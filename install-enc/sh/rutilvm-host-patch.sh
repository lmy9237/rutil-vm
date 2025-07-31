#!/bin/bash

# ─────────────────────────────────────────────────────────────
# 안전 종료 처리 (Ctrl+C 등 사용자 강제 종료 시)
# ─────────────────────────────────────────────────────────────
cleanup_and_exit() {
	echo -e "\nThe task has been interrupted by user request."
	if [[ -n "$progress_pid" ]]; then
		kill "$progress_pid" >/dev/null 2>&1
		wait "$progress_pid" 2>/dev/null
	fi
	exit 1
}

trap cleanup_and_exit SIGINT SIGTERM

# IPv4 주소 유효성 검사 함수
is_valid_ipv4() {
	local ip="$1"
	local regex='^([1-9][0-9]{0,2}|0)\.([1-9][0-9]{0,2}|0)\.([1-9][0-9]{0,2}|0)\.([1-9][0-9]{0,2}|0)$'
	if [[ $ip =~ $regex ]]; then
		IFS='.' read -r a b c d <<< "$ip"
		if ((a >= 0 && a <= 255 && b >= 0 && b <= 255 && c >= 0 && c <= 255 && d >= 0 && d <= 255)); then
			for octet in "$a" "$b" "$c" "$d"; do
				if [[ $octet =~ ^0[0-9]+$ ]]; then
					return 1
				fi
			done
			return 0
		fi
	fi
	return 1
}

# 포트 번호 유효성 검사 함수 (1~65535)
is_valid_port() {
	local port="$1"
	if [[ "$port" =~ ^[0-9]+$ ]] && ((port >= 1 && port <= 65535)); then
		return 0
	else
		return 1
	fi
}

# ─────────────────────────────────────────────────────────────
# 사용자 입력 받기 - IP 유효성 검사 + ping 테스트
# ─────────────────────────────────────────────────────────────
while true; do
	read -p "RutilVM Engine IP address: " cloudinitVMStaticCIDR
	if ! is_valid_ipv4 "$cloudinitVMStaticCIDR"; then
		echo "Invalid IPv4 address. Please enter a valid IPv4 address (e.g., 192.168.0.10)."
		continue
	fi

	if ping -c 2 -W 1 "$cloudinitVMStaticCIDR" >/dev/null 2>&1; then
		break
	else
		echo "Cannot reach $cloudinitVMStaticCIDR. Please check the IP and try again."
	fi
done

# ─────────────────────────────────────────────────────────────
# 포트 입력 받기 - 기본값 또는 1~65535 범위 확인
# ─────────────────────────────────────────────────────────────
while true; do
	read -p "RutilVM Engine SSH port (default: 22): " ssh_port
	ssh_port=${ssh_port:-22}
	if is_valid_port "$ssh_port"; then
		break
	else
		echo "Invalid port. Please enter a number between 1 and 65535."
	fi
done

read -p "RutilVM Engine username (default: root): " remote_user
remote_user=${remote_user:-root}

read -s -p "RutilVM Engine user's password: " cloudinitRootPwd
echo

# 압축 해제 비밀번호 고정
cloudinitEnginePwd="itinfo1!"

# ─────────────────────────────────────────────────────────────
# 진행중 표시 (백그라운드)
# ─────────────────────────────────────────────────────────────
show_progress() {
	while true; do
		printf "."
		sleep 1
	done
}
show_progress &
progress_pid=$!

# ─────────────────────────────────────────────────────────────
# engine.zip 파일 원격지로 복사
# ─────────────────────────────────────────────────────────────
sshpass -p "$cloudinitRootPwd" scp -P "$ssh_port" -o StrictHostKeyChecking=no ./engine.zip "$remote_user@$cloudinitVMStaticCIDR":/var/share/pkg/rutilvm/ >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."

# ─────────────────────────────────────────────────────────────
# 원격지에서 압축 해제
# ─────────────────────────────────────────────────────────────
sshpass -p "$cloudinitRootPwd" ssh -p "$ssh_port" -o StrictHostKeyChecking=no "$remote_user@$cloudinitVMStaticCIDR" \
	"export UNZIP_DISABLE_ZIPBOMB_DETECTION=TRUE; /usr/bin/unzip -q -P '$cloudinitEnginePwd' -o /var/share/pkg/rutilvm/engine.zip -d /var/share/pkg/rutilvm/" >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."

# ─────────────────────────────────────────────────────────────
# 도커 정리 및 엔진 스크립트 실행
# ─────────────────────────────────────────────────────────────
ssh_cmd() {
	sshpass -p "$cloudinitRootPwd" ssh -tt -p "$ssh_port" -o StrictHostKeyChecking=no "$remote_user@$cloudinitVMStaticCIDR" "$1"
}

ssh_cmd 'running=$(docker ps -q); [ -n "$running" ] && docker stop $running || true' >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
ssh_cmd 'all=$(docker ps -aq); [ -n "$all" ] && docker rm $all || true' >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
ssh_cmd 'images=$(docker images -q); [ -n "$images" ] && docker rmi $images -f || true' >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
ssh_cmd 'docker container prune -f' >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
ssh_cmd 'systemctl stop docker && systemctl daemon-reload' >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
ssh_cmd 'chmod 755 /var/share/pkg/rutilvm/engine/*.sh' >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
ssh_cmd '/var/share/pkg/rutilvm/engine/rutilvm-engine-setup.sh' >/dev/null 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."

# 백그라운드 진행 표시 중단
kill "$progress_pid" >/dev/null 2>&1
wait "$progress_pid" 2>/dev/null

echo -e "\nRutilVM Hosted Engine successfully Patched"
