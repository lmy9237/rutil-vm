#!/usr/bin/python3
"""
date: 20250729-02
RutilVM Assistor - Improved for faster loading by parallelizing API calls

섹션 순서:
  Section 1: Imports and Common Utility Functions
  Section 2: Session and Connection Management Functions
  Section 3: Main Menu Function
  Section 4: Virtual Machine Section
  Section 5: Data Center Section
  Section 6: Cluster Section
  Section 7: Host Section
  Section 8: Network Section
  Section 9: Storage Domain Section
  Section 10: Disk Section
  Section 11: User Section
  Section 12: Certificate Section
  Section 13: Events Section
  Section 14: Main Execution Block
                1) UI 매핑
                    "--vm":          -> show_virtual_machines, -> Section 4: Virtual Machine Section
                    "--datacenter":  -> show_data_centers,     -> Section 5: Data Center Section
                    "--cluster":     -> show_clusters,         -> Section 6: Cluster Section
                    "--host":        -> show_hosts,            -> Section 7: Host Section
                    "--network":     -> show_networks,         -> Section 8: Network Section
                    "--storage":     -> show_storage_domains,  -> Section 9: Storage Domain Section
                    "--disk":        -> show_storage_disks,    -> Section 10: Disk Section
                    "--user":        -> show_users,            -> Section 11: User Section
                    "--certificate": -> show_certificates,     -> Section 12: Certificate Section
                    "--event":       -> show_events,           -> Section 13: Events Section
                2) 단일 CLI 명령 매핑
                3) 인자 파싱 및 --help
                4) invalid 옵션 검사
                5) --deploy 처리
                    --deploy --host
                    --deploy --engine
                    --deploy --all
                    --deploy --standard
                    --deploy --key
                6) 단일 CLI 명령 처리
                7) 인증 및 연결 초기화
                8) curses UI 호출 또는 메인 메뉴
"""

# =============================================================================
# Section 1: Imports and Common Utility Functions
# =============================================================================
import os               # 운영체제와 상호작용하는 함수 제공 (파일 경로, 환경 변수 등)
import sys              # 시스템 관련 기능 제공 (프로그램 종료, 명령행 인수 등)
#import getpass          # 사용자로부터 비밀번호 입력 시 에코 없이 입력받기 위한 모듈
import curses           # 터미널 기반 UI 구현을 위한 모듈
import subprocess       # 외부 프로세스 실행 및 관리에 사용
import unicodedata      # 유니코드 문자 관련 정보 제공 (문자 폭 계산 등)
import requests         # HTTP 요청 전송을 위한 라이브러리
import xml.etree.ElementTree as ET  # XML 데이터 파싱 및 생성
import urllib3          # HTTPS 요청 시 경고 제어 및 커넥션 풀 관리
import re               # 정규 표현식 관련 함수 제공
import pickle           # 파이썬 객체를 직렬화(저장) 및 역직렬화(불러오기)
import signal           # 시그널 처리 (프로세스 종료, 인터럽트 등) 지원
import textwrap         # 긴 텍스트를 자동으로 줄바꿈하는 기능 제공
import time             # 시간 관련 함수 (지연, 타이밍 등) 제공
import threading        # 스레드 기반 병렬 처리를 위한 모듈
import socket           # 네트워크 연결 및 소켓 프로그래밍 지원
import math             # 수학 함수 및 상수 제공
import locale           # 로케일 설정 및 지역화 관련 기능 제공
import shlex            # 쉘 명령어 파싱을 위한 도구 제공
import tempfile         # 임시 파일/디렉터리 생성 관련 함수 제공
import stat             # 파일의 상태 및 권한 정보를 다루기 위한 모듈
import pexpect          # 자식 프로세스와의 상호작용을 위한 모듈
import concurrent.futures  # 병렬 작업(멀티스레딩, 멀티프로세싱)을 위한 모듈
import ovirtsdk4.types as types  # oVirt SDK에서 제공하는 다양한 타입 정의를 사용
import tty, termios     # 터미널의 입력 모드를 변경, POSIX 시스템에서 터미널의 속성을 제어
import glob  # 파일 경로 패턴 매칭(예: /tmp/*.pkl) 및 파일 목록 조회를 위한 표준 라이브러리
from cryptography.fernet import Fernet
from datetime import datetime, timezone  # 날짜/시간 처리와 타임존 정보를 위한 모듈
from ovirtsdk4.types import Host, VmStatus, Ip, IpVersion  # oVirt SDK의 특정 타입들을 개별적으로 임포트
from ovirtsdk4 import Connection, Error  # oVirt SDK 연결 기능과 오류 처리를 위한 클래스들
from requests.auth import HTTPBasicAuth  # HTTP 기본 인증 처리를 위한 클래스
from ovirtsdk4 import types  # oVirt SDK에서 제공하는 타입 모듈 (중복 임포트 주의)
from threading import Thread  # 스레드 실행을 위한 Thread 클래스 임포트
from urllib.parse import urlparse  # URL을 파싱하기 위한 함수 제공
from concurrent.futures import ThreadPoolExecutor, as_completed  # 스레드 풀 생성 및 작업 완료 감지를 위한 함수들
from ovirtsdk4.types import Domain, User, Permission  # 인증 도메인 지정,사용자 정보·그룹에 부여된 정보,권한 설정을 표현
from ovirtsdk4.types import Role  # Role 타입이 필요하다면 import
from subprocess import PIPE  #Subprocess 모듈의 PIPE 상수 임포트 (표준 입출력 캡처용)
locale.setlocale(locale.LC_ALL, '')  # 현재 시스템의 로케일 설정을 로컬 기본값으로 초기화

# SSH 포트 변경 감지시 새로운 포트 정보를 저장하는 파일
SSH_PORT_FILE = "/etc/ssh_port.conf"

def load_ssh_port(default=22):
    try:
        with open(SSH_PORT_FILE, "r") as f:
            port = int(f.read().strip())
            return port
    except Exception:
        return default

def save_ssh_port(port):
    with open(SSH_PORT_FILE, "w") as f:
        f.write(str(port))

# SSH 포트 번호 변경 감지 시 새로운 포트 번호 입력 창
def prompt_ssh_port_popup(stdscr, host=None):
    """
    SSH 포트가 변경되었을 때 사용자로부터 새 포트를 입력받는 팝업창.
    - ESC 키로만 취소
    - 숫자·범위 오류 또는 연결 실패 시 중앙 정렬된 오류 메시지(2초) 후 재입력
    - 백스페이스, 숫자 입력 후에도 정상 동작
    """
    import socket, curses

    h, w = stdscr.getmaxyx()
    win_h, win_w = 14, 60
    win_y, win_x = (h - win_h) // 2, (w - win_w) // 2

    label_x = 2
    input_y = 7
    prompt_label = "Port: "
    footer = "ENTER=Commit | ESC=Cancel"
    max_len = 5
    x_pos = label_x + len(prompt_label)

    while True:
        # 팝업창 초기화
        win = curses.newwin(win_h, win_w, win_y, win_x)
        win.keypad(True)
        curses.noecho()
        curses.curs_set(1)
        win.erase()
        win.border()

        # 타이틀 및 안내문
        title = "SSH Port Number" + (f" ({host})" if host else "")
        win.addstr(1, (win_w - len(title)) // 2, title, curses.A_BOLD)
        win.addstr(4, label_x, "The SSH port number has changed.")
        win.addstr(5, label_x, "Enter the new SSH port number (1–65535).")

        # 입력창 라벨 & 푸터
        win.addstr(input_y, label_x, prompt_label)
        win.addstr(win_h - 2, (win_w - len(footer)) // 2, footer, curses.A_DIM)
        win.refresh()

        # 입력 버퍼
        port_chars = []

        # 사용자 키 입력 처리 루프
        while True:
            win.move(input_y, x_pos + len(port_chars))
            ch = win.getch()

            # ESC → 취소
            if ch == 27:
                curses.curs_set(0)
                return None
            # Enter → 입력 완료
            if ch in (10, 13):
                break
            # Backspace → 한 글자 지우기
            if ch in (curses.KEY_BACKSPACE, 127, 8):
                if port_chars:
                    port_chars.pop()
                    win.addstr(input_y, x_pos, " " * max_len)
                    win.addstr(input_y, x_pos, "".join(port_chars))
                    win.refresh()
                continue
            # 숫자 입력 허용
            if 48 <= ch <= 57 and len(port_chars) < max_len:
                port_chars.append(chr(ch))
                win.addstr(input_y, x_pos + len(port_chars) - 1, chr(ch))
                win.refresh()
                continue
            # 그 외 키 무시

        # 입력 완료 후 커서 숨기기
        curses.curs_set(0)
        port_str = "".join(port_chars).strip()

        # 1) 형식 및 범위 검사
        try:
            port = int(port_str)
            assert 1 <= port <= 65535
        except Exception:
            msg = f"Invalid port '{port_str}'"
            x = (win_w - len(msg)) // 2
            win.addstr(win_h - 4, x, msg, curses.A_NORMAL)
            win.refresh()
            curses.napms(2000)
            win.addstr(win_h - 4, x, " " * len(msg))
            continue

        # 2) 실제 연결 테스트
        try:
            sock = socket.create_connection((host, port), timeout=2)
            sock.close()
        except Exception:
            msg = f"Port '{port}' unreachable"
            x = (win_w - len(msg)) // 2
            win.addstr(win_h - 4, x, msg, curses.A_NORMAL)
            win.refresh()
            curses.napms(2000)
            win.addstr(win_h - 4, x, " " * len(msg))
            continue

        # 유효 포트 입력 시 반환
        return port

# SSH 명령어 prefix 생성 함수로 통합
def get_ssh_prefix():
    port = load_ssh_port()
    return f"-p {port} {CONTROL_OPTS}"

# CONTROL_OPTS 정의는 그대로 두고, SSH_PREFIX는 이제 빈 문자열로
SSH_PREFIX = ""
# CONTROL_OPTS = "-o ControlMaster=auto -o ControlPath=/tmp/ssh_mux_%r@%h:%p"
CONTROL_OPTS = "-o ControlMaster=auto -o ControlPath=/tmp/ssh_mux_%r@%h:%p"

def get_users_output(engine_host):
    """
    SSH를 이용해 oVirt 엔진에서 사용자 목록을 가져오며, 결과를 캐싱하고,
    Connection refused 또는 라우팅 오류 시에는 새 포트를 입력받아 재시도함
    최종 실패 시에는 저장된 포트 파일을 삭제하여 다음 호출 시 기본 포트로 되돌림
    """
    global _USERS_CACHE, _CACHE_TIMEOUT, SSH_PORT_FILE

    now = time.time()
    # 1) 캐시된 결과가 유효하면 반환
    if engine_host in _USERS_CACHE:
        cached_time, cached_output = _USERS_CACHE[engine_host]
        if now - cached_time < _CACHE_TIMEOUT:
            return cached_output

    # 2) 첫 번째 SSH 시도
    ssh_opts = get_ssh_prefix()
    cmd = (
        f"{SSH_PREFIX}ssh {ssh_opts} -o StrictHostKeyChecking=no "
        f"rutilvm@{engine_host} \"ovirt-aaa-jdbc-tool query --what=user\""
    )
    result = subprocess.run(
        cmd, shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True,
        timeout=15
    )

    # 3) Connection refused 감지 시 포트 재입력 후 재시도
    if result.returncode != 0 and "Connection refused" in result.stderr:
        stdscr = curses.initscr()
        new_port = prompt_ssh_port_popup(stdscr)
        curses.endwin()
        if new_port:
            ssh_opts = get_ssh_prefix()
            cmd = (
                f"{SSH_PREFIX}ssh {ssh_opts} -o StrictHostKeyChecking=no "
                f"rutilvm@{engine_host} \"ovirt-aaa-jdbc-tool query --what=user\""
            )
            result = subprocess.run(
                cmd, shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True,
                timeout=15
            )
            
    # 4) 최종 오류 처리 — 실패 시 잘못된 포트 파일 삭제
    if result.returncode != 0:
        try:
            os.remove(SSH_PORT_FILE)
        except OSError:
            pass

        err = result.stderr.strip()
        if "Permission denied" in err or "publickey" in err:
            err = "The SSH port number is incorrect. Check the SSH port number and try again."
        # 원문 에러 메시지만 전달하도록 수정
        raise Exception(err)

    # 5) 성공 시 출력 캐싱 및 반환
    output = result.stdout
    _USERS_CACHE[engine_host] = (now, output)
    return output

# "입력한 문자를 '*'로 표시"하는 함수 정의
def get_password_masked(prompt=""):
    """
    사용자로부터 비밀번호를 입력받을 때, 화면에 입력 문자를 '*'로 표시함
    백스페이스(DEL 또는 BS)를 누르면 즉시 화면상의 '*'가 지워지고, 내부 문자열에서도 마지막 문자가 제거됨
    Enter 키를 누르면 입력을 종료하고 입력된 문자열을 반환함
    """
    sys.stdout.write(prompt)
    sys.stdout.flush()

    password = ""
    fd = sys.stdin.fileno()

    # 1) 현재 터미널 설정을 저장
    old_attrs = termios.tcgetattr(fd)
    # 2) 복사하여 새로운 속성을 생성
    new_attrs = termios.tcgetattr(fd)

    # 3) 로컬 모드(local flags)에서 ECHO(에코)와 ICANON(정규 모드) 비활성화
    new_attrs[3] &= ~(termios.ECHO | termios.ICANON)
    # ICANON을 끄면, Enter를 칠 때까지 한 글자씩 버퍼링하지 않고 즉시 read가 가능
    # ECHO를 끄면, 터미널이 직접 입력 문자를 화면에 표시하지 않음

    try:
        # 4) 터미널에 새 설정 적용
        termios.tcsetattr(fd, termios.TCSADRAIN, new_attrs)

        while True:
            ch = sys.stdin.read(1)

            # Enter(개행) 처리: '\r' 또는 '\n' 중 하나
            if ch in ('\r', '\n'):
                sys.stdout.write("\n")
                sys.stdout.flush()
                break

            # 백스페이스 처리: DEL('\x7f') 또는 BS('\x08')
            if ch in ('\x7f', '\x08'):
                if len(password) > 0:
                    # 내부적으로 저장된 마지막 문자 제거
                    password = password[:-1]
                    # 화면상의 '*' 한 개 지우기: 백스페이스, 공백, 백스페이스
                    sys.stdout.write("\b \b")
                    sys.stdout.flush()
                # password가 비어 있으면 아무 동작도 하지 않음
                continue

            # 그 외 일반 문자 입력 시
            password += ch
            sys.stdout.write("*")
            sys.stdout.flush()

    finally:
        # 5) 원래 터미널 설정으로 반드시 복원
        termios.tcsetattr(fd, termios.TCSADRAIN, old_attrs)

    return password

# HTTPS 경고 메시지 비활성화
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def truncate_with_ellipsis(value, max_width):
    """
    문자열의 길이가 max_width보다 길면 생략 부호(..)를 추가하여 잘라 반환
    """
    # None 또는 빈 값이면 "-"로 대체
    value = str(value) if value else "-"
    # 문자열 길이가 최대 너비를 초과하면
    if len(value) > max_width:
        # 앞부분만 남기고 ".." 추가
        return value[:max_width - 2] + ".."
    # 길이가 초과하지 않으면 원본 문자열 반환
    return value

def get_network_speed(interface):
    """
    ethtool을 사용하여 네트워크 인터페이스의 실제 속도를 확인하는 함수
    실패 시 "N/A"를 반환
    """
    try:
        # ethtool 명령어 실행하여 인터페이스 정보 가져오기
        result = subprocess.run(['ethtool', interface],
                                stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE,
                                universal_newlines=True)
        # 출력 결과에서 "Speed:" 라인을 찾아 속도 추출
        for line in result.stdout.splitlines():
            if "Speed:" in line:
                return line.split(":")[1].strip()
    except Exception as e:
        # ethtool 실행 실패 또는 파싱 실패 시 에러 출력
        print(f"Error getting speed for {interface}: {e}")
    # 실패하거나 Speed 정보를 찾지 못하면 "N/A" 반환
    return "N/A"

def get_display_width(text, max_width):
    """
    동아시아 문자는 2칸으로 계산하여, 텍스트의 실제 출력 폭이 max_width를 초과하면
    마지막에 ".."를 붙여 자르고, 그렇지 않으면 오른쪽에 공백을 추가하여 고정 폭 문자열을 반환함
    """
    # 텍스트의 실제 표시 폭 계산 (F, W 너비 문자는 2칸, 그 외는 1칸)
    disp_width = sum(2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1 for c in text)
    if disp_width > max_width:
        # 출력 폭이 max_width를 초과하는 경우
        truncated = ""  # 잘린 텍스트 저장
        current = 0     # 현재까지 누적된 표시 폭
        for char in text:
            # 현재 문자의 표시 폭 계산
            char_w = 2 if unicodedata.east_asian_width(char) in ('F', 'W') else 1
            # 추가 시 max_width - 2를 넘으면 중단 (".."을 붙이기 위해 2칸 남겨야 함)
            if current + char_w > max_width - 2:
                break
            truncated += char
            current += char_w
        # 잘린 텍스트 뒤에 ".." 추가하여 반환
        return truncated + ".."
    else:
        # 출력 폭이 max_width 이하인 경우
        # 오른쪽에 남은 공백을 추가하여 고정 폭 문자열로 반환
        padding = max_width - disp_width
        return text + " " * padding

def draw_status_bar(stdscr, y, left_text, right_text, total_width=121):
    # 상태 표시줄(왼쪽, 오른쪽 텍스트)을 출력
    spaces = " " * max(total_width - len(left_text) - len(right_text), 1)
    stdscr.addstr(y, 1, left_text + spaces + right_text, curses.A_NORMAL)

def adjust_column_width(text, width):
    """테이블 열에 맞게 텍스트에 공백을 추가하여 맞춤 처리"""
    text = text if text else "-"
    text_width = sum(2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1 for c in text)
    padding = max(0, width - text_width)
    return text + " " * padding

def ensure_non_empty(value):
    """값이 비어 있으면 '-'를, 그렇지 않으면 원래 값을 반환"""
    return "-" if not value or str(value).strip() == "N/A" else value

def draw_table(stdscr, start_y, headers, col_widths, data, row_func, current_row=-1):
    """
    curses 화면에 테이블을 그리는 함수
      - headers: 각 열의 제목
      - col_widths: 각 열의 너비
      - data: 데이터 리스트
      - row_func: 각 데이터 항목을 리스트 형태로 반환하는 함수
      - current_row: 현재 선택된 행(강조 처리)
    """
    # 테이블 상단 테두리 생성
    header_line = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
    # 헤더와 데이터 구분선 생성
    divider_line = "├" + "┼".join("─" * w for w in col_widths) + "┤"
    # 테이블 하단 테두리 생성
    footer_line = "└" + "┴".join("─" * w for w in col_widths) + "┘"
    # 테이블 상단 출력
    stdscr.addstr(start_y, 1, header_line)
    stdscr.addstr(start_y + 1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(headers, col_widths)) + "│")
    stdscr.addstr(start_y + 2, 1, divider_line)

    # 데이터가 없는 경우 빈 행 출력
    if not data:
        empty_row = "│" + "│".join(get_display_width("-", w) for w in col_widths) + "│"
        stdscr.addstr(start_y + 3, 1, empty_row)
    else:
        # 데이터가 있는 경우 행별로 출력
        for idx, item in enumerate(data):
            row_y = start_y + 3 + idx  # 출력할 Y 위치
            row_data = [ensure_non_empty(d) for d in row_func(item)]  # 데이터 항목 가공
            row_text = "│" + "│".join(get_display_width(d, w) for d, w in zip(row_data, col_widths)) + "│"
            if idx == current_row:
                # 현재 선택된 행이면 강조 표시
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(row_y, 1, row_text)
                stdscr.attroff(curses.color_pair(1))
            else:
                # 선택되지 않은 행은 일반 출력
                stdscr.addstr(row_y, 1, row_text)
    # 테이블 하단 출력
    stdscr.addstr(start_y + 3 + max(len(data), 1), 1, footer_line)

def safe_gethostbyname(address):
    """
    주어진 주소(address)를 IP로 변환
    실패할 경우 "-" 반환
    """
    try:
        # 주소를 IP로 변환 시도
        return socket.gethostbyname(address)
    except Exception:
        return "-"  # 변환 실패 시 "-"

def show_error_popup(stdscr, title, message):
    # 터미널 크기와 팝업창 크기 결정
    height, width = stdscr.getmaxyx()
    popup_height = min(12, height - 2)
    popup_width = min(60, width - 4)
    popup_y = max(0, (height - popup_height) // 2)
    popup_x = max(0, (width - popup_width) // 2)
    
    # 팝업 창 생성 및 초기화
    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)
    popup.clear()
    popup.border()

    # 제목 출력: 제목의 글자수를 기준으로 가운데 정렬
    # 만약 제목이 너무 길면 팝업 폭에 맞게 잘라냄
    max_title_length = popup_width - 2
    if len(title) > max_title_length:
        title = title[:max_title_length]
    title_x = (popup_width - len(title)) // 2
    popup.addstr(1, title_x, title)
    
    # 메시지를 팝업창 너비에 맞게 여러 줄로 분리
    available_width = popup_width - 4  # 좌우 여백 고려
    wrapped_lines = textwrap.wrap(message, width=available_width)
    # 팝업창에 표시할 수 있는 최대 메시지 줄 수:
    # 상단: 테두리(행 0), 제목(행 1), 빈 줄(행 2)
    # 하단: 빈 줄(행 popup_height-3), 안내 메시지(행 popup_height-2), 테두리(행 popup_height-1)
    max_message_lines = popup_height - 6  

    for i, line in enumerate(wrapped_lines[:max_message_lines]):
        # 마지막 줄인데 전체 메시지를 다 보여주지 못하는 경우 ".."를 강제로 붙임
        if i == max_message_lines - 1 and len(wrapped_lines) > max_message_lines:
            truncated_line = force_truncate_line(line, available_width)
        else:
            if len(line) > available_width:
                truncated_line = line[:available_width]
            else:
                truncated_line = line
        popup.addstr(3 + i, 2, truncated_line)
    
    # 하단 안내 메시지 출력: 글자수를 기준으로 가운데 정렬
    footer = "Press any key to continue"
    max_footer_length = popup_width - 2
    if len(footer) > max_footer_length:
        footer = footer[:max_footer_length]
    footer_x = (popup_width - len(footer)) // 2
    popup.addstr(popup_height - 2, footer_x, footer, curses.A_DIM)
    
    popup.refresh()
    popup.getch()
    popup.clear()
    stdscr.touchwin()
    stdscr.refresh()
 
def init_curses_colors():
    # 커서 숨기기
    curses.curs_set(0)
    # 색상 기능 활성화
    curses.start_color()
    # 색상 조합 정의 (전경색, 배경색)
    curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_CYAN)    # 선택된 항목 강조용
    curses.init_pair(2, curses.COLOR_BLACK, curses.COLOR_WHITE)   # 기본 강조용
    curses.init_pair(3, curses.COLOR_GREEN, curses.COLOR_BLACK)   # 정상(green) 상태 표시용
    curses.init_pair(4, curses.COLOR_YELLOW, curses.COLOR_BLACK)  # 경고(yellow) 상태 표시용
    curses.init_pair(5, curses.COLOR_RED, curses.COLOR_BLACK)     # 오류(red) 상태 표시용

# =============================================================================
# Section 2: Session and Connection Management Functions
# =============================================================================
def valid_ip(ip):
    """
    입력된 문자열이 유효한 IPv4 주소인지 검사함
    """
    pattern = re.compile(
        r'^((25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}'
        r'(25[0-5]|2[0-4]\d|[01]?\d?\d)$'
    )
    return bool(pattern.match(ip))

# rutilvm 명령시 실행 여부 판단. 
# engine 미 배포시 "You must run deploy first" 출력
# engine 배포시 hosted-engine.conf에서 FQDN 값을 읽고,
# /etc/hosts에 매핑이 없으면 사용자 입력을 받아 새로 추가
# engine을 배포한 호스트의 경우 /etc/hosts에 매핑 해당 안됨
def get_fqdn_from_config():
    """
    1. /etc/ovirt-hosted-engine/hosted-engine.conf 파일이 없으면 에러를 출력하고 종료
    2. 파일에서 fqdn 값을 추출
    3. /etc/hosts에 이미 매핑된 항목이 있으면 해당 fqdn 반환
    4. 매핑이 없으면 사용자에게 IP 입력을 반복 요청(유효성 검사 포함)
    5. 같은 IP로 매핑된 기존 줄 삭제
    6. 새로운 "{IP} {fqdn}" 줄을 /etc/hosts에 추가 후 fqdn 반환
    """
    config_path = "/etc/ovirt-hosted-engine/hosted-engine.conf"
    hosts_path = "/etc/hosts"

    # 1) 설정 파일 존재 여부 확인
    if not os.path.isfile(config_path):
        print("You must run deploy first")
        sys.exit(1)

    # 2) 설정 파일에서 fqdn 값 추출
    fqdn = None
    with open(config_path, "r") as f:
        for line in f:
            match = re.match(r"^fqdn=(.+)$", line.strip())
            if match:
                fqdn = match.group(1)
                break

    if not fqdn:
        print("No FQDN for RutilVM Engine")
        sys.exit(1)

    # 3) /etc/hosts에 이미 매핑된 fqdn이 있는지 확인
    with open(hosts_path, "r") as f:
        for line in f:
            content = line.split("#", 1)[0].strip()
            parts = content.split()
            if len(parts) >= 2 and fqdn in parts[1:]:
                return fqdn  # 이미 매핑되어 있으면 반환

    # 4) 사용자에게 IP 주소 입력 반복 요청 (유효성 검사)
    while True:
        ip = input("RutilVM Engine IP address: ").strip()
        if not valid_ip(ip):
            print("Invalid IP address. Please try again.")
            continue
        break

    # 5) 동일한 IP로 매핑된 기존 줄 삭제
    new_lines = []
    with open(hosts_path, "r") as f:
        for line in f:
            stripped = line.split("#", 1)[0].strip()
            if stripped:
                first_token = stripped.split()[0]
                if first_token == ip:
                    # 해당 IP 매핑 줄은 건너뜁니다
                    continue
            new_lines.append(line)

    # 6) 새로운 매핑 줄을 추가
    new_lines.append(f"{ip} {fqdn}\n")

    # /etc/hosts 파일에 덮어쓰기
    with open(hosts_path, "w") as f:
        f.writelines(new_lines)

    return fqdn

# /etc/hosts 파일에서 입력된 fqdn(fully-qualified domain name)과 매칭되는 IP 주소를 찾아 반환하는 함수
def get_ip_from_hosts(fqdn):
    """
    /etc/hosts 파일에서 fqdn과 매칭되는 IP 주소를 찾아 반환
    """
    hosts_path = "/etc/hosts"  # /etc/hosts 파일의 경로를 지정
    try:
        # /etc/hosts 파일을 읽기 모드("r")로 염
        with open(hosts_path, "r") as file:
            for line in file:
                # 주석 부분 제거: '#' 기호를 기준으로 문자열을 나눈 후 좌측 부분만 사용하며 양쪽 공백을 제거
                line = line.split("#")[0].strip()
                # 만약 fqdn이 현재 라인에 포함되어 있다면
                if fqdn in line:
                    # 공백을 기준으로 라인을 분리해서 리스트로 저장 (IP와 호스트명이 분리됨)
                    parts = line.split()
                    # 최소 두 개 이상의 항목이 있고, fqdn이 두 번째 이후 항목에 포함되면
                    if len(parts) >= 2 and fqdn in parts[1:]:
                        # 첫 번째 항목(일반적으로 IP 주소)을 반환
                        return parts[0]
    except FileNotFoundError:
        # 파일이 존재하지 않을 경우, 배포(deploy)가 먼저 수행되어야 함을 알림
        print("You must run deploy first")
        sys.exit(1)
    except Exception:
        # 기타 예외 발생 시에도 배포가 선행되지 않았음을 알림
        print("You must run deploy first")
        sys.exit(1)
    # 지정된 fqdn을 찾지 못한 경우에도 배포가 선행되지 않았음을 알림
    print("You must run deploy first")
    sys.exit(1)

# 암호화에 사용할 키 파일의 경로를 전역 변수로 정의
KEY_FILE = "/etc/ovirt-hosted-engine/engine_session.key"
try:
    tty_name = os.ttyname(0)  # 표준 입력(터미널)의 이름을 가져옴, 예: /dev/pts/0
except Exception:
    tty_name = os.environ.get("SSH_CONNECTION", "local_session")
SESSION_IDENTIFIER = tty_name.replace("/", "_")  # '/' 문자는 파일명에 쓸 수 없으므로 다른 문자로 치환
SESSION_FILE = f"/tmp/session_{SESSION_IDENTIFIER}.pkl"

def load_key():
    """키 파일이 없으면 생성하고, 있으면 로드"""
    if not os.path.exists(KEY_FILE):
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as key_file:
            key_file.write(key)
        os.chmod(KEY_FILE, 0o600)
    else:
        with open(KEY_FILE, "rb") as key_file:
            key = key_file.read()
    return key

# 전역 fernet 객체 생성
fernet = Fernet(load_key())

# 터미널 세션 식별자 생성: SSH 연결 정보가 있으면 해당 정보를 사용, 없으면 "local_session"으로 지정,
# 그리고 공백을 밑줄(_)로 대체함
TERMINAL_SESSION_ID = os.environ.get("SSH_CONNECTION", "local_session").replace(" ", "_")
# 세션 데이터를 저장할 파일 경로 생성: /tmp 디렉토리에 session_ 터미널 ID를 포함하는 pkl 파일
SESSION_FILE = f"/tmp/session_{TERMINAL_SESSION_ID}.pkl"
session_data = None  # 메모리 내 세션 데이터를 저장할 변수 (초기 상태는 None)
delete_session_on_exit = False  # 종료 시 세션 삭제 여부를 결정하는 플래그, 초기값은 False

def save_session(username, password, url):
    """
    세션 데이터를 딕셔너리로 구성하여 pickle로 직렬화한 후 암호화하여 세션 파일에 저장함
    여기에 현재 터미널(tty) 정보, 프로세스 ID, 생성 시각(timestamp)도 함께 저장함
    """
    try:
        current_tty = os.ttyname(0)  # 현재 터미널(예: /dev/pts/0)
    except Exception:
        current_tty = "unknown"
    session_data = {
        "username": username,
        "password": password,
        "url": url,
        "tty": current_tty,         # 현재 터미널 식별자 저장
        "pid": os.getpid(),         # 현재 프로세스 ID 저장
        "timestamp": time.time()    # 세션 저장 시각
    }
    pickled_data = pickle.dumps(session_data)
    encrypted_data = fernet.encrypt(pickled_data)
    with open(SESSION_FILE, "wb") as file:
        file.write(encrypted_data)
    os.chmod(SESSION_FILE, 0o600)

def load_session():
    """
    세션 파일이 존재하면 암호화된 데이터를 복호화하여 세션 정보를 반환함
    단, 저장된 세션의 터미널 식별자(tty)가 현재 터미널의 tty와 다르면 None을 반환하여 새 로그인으로 처리함
    """
    if os.path.exists(SESSION_FILE) and os.path.getsize(SESSION_FILE) > 0:
        try:
            # 세션 파일 열기
            with open(SESSION_FILE, "rb") as file:
                encrypted_data = file.read()
            # 암호화된 데이터를 복호화
            pickled_data = fernet.decrypt(encrypted_data)
            # 복호화된 데이터를 세션 객체로 변환
            session_data = pickle.loads(pickled_data)
            try:
                # 현재 터미널의 tty 경로 가져오기
                current_tty = os.ttyname(0)
            except Exception:
                current_tty = "unknown"
            # 저장된 세션의 tty와 현재 tty가 다르면 새 세션으로 간주
            if session_data.get("tty") != current_tty:
                return None
            # 세션 유효 → 세션 데이터 반환
            return session_data
        except Exception as e:
            # 복호화 또는 불러오기 실패 시 오류 출력 후 None 반환
            print(f"세션 로드 오류: {e}")
            return None
    # 세션 파일이 없거나 크기가 0이면 None 반환
    return None

def cleanup_old_sessions():
    """
    /tmp 디렉토리 내의 session_*.pkl 파일 중 현재 세션 파일을 제외한 모든 파일을 삭제함
    """
    # /tmp 경로 내 session_*.pkl 파일 목록 가져오기
    session_files = glob.glob("/tmp/session_*.pkl")
    for file in session_files:
        if file != SESSION_FILE:
            try:
                # 현재 세션 파일이 아닌 경우 삭제
                os.remove(file)
            except Exception:
                # 삭제 실패 시 무시
                pass

def signal_handler(sig, frame):
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGHUP, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# =============================================================================
# 도움말 출력 함수
# =============================================================================
def print_help():
    print("Usage: rutilvm [OPTION]\n")
    print("Options:")
    print("  --datacenter")
    print("      Show Data Center screen")
    print("  --cluster")
    print("      Show Cluster screen")
    print("  --host")
    print("      Show Host screen")
    print("  --network")
    print("      Show Network screen")
    print("  --storage")
    print("      Show Storage Domain screen")
    print("  --disk")
    print("      Show Disk screen")
    print("  --user")
    print("      Show User screen")
    print("  --certificate")
    print("      Show Certificate screen")
    print("  --event")
    print("      Show Events screen")
    print("  --vm")
    print("      Show Virtual Machines screen")
    print("  --vm-status")
    print("      VM status according to the HA agent.")
    print("  --deploy --host")
    print("      Run deployment shell script for Host configuration")
    print("  --deploy --engine")
    print("      Run deployment shell script for Engine configuration")
    print("  --deploy --all")
    print("      RutilVM Installation and Setup")
    print("  --deploy --key")
    print("      rutilvm public key distribution")
    print("  --vm-start")
    print("      Start Engine on this host")
    print("  --vm-start-paused")
    print("      Start Engine on this host with qemu paused")
    print("  --vm-shutdown")
    print("      Set maintenance status to local")
    print("  --set-maintenance --mode=none")
    print("      Disable maintenance status")
    print("  --reinitialize-lockspace")
    print("      Reinitialize the sanlock lockspaces")
    print("  --clean-metadata")
    print("      Remove the metadata for the current host's agent")
    sys.exit(0)

# =============================================================================
# Section 3: Main Menu Function
# =============================================================================
def main_menu(stdscr, connection):
    # --- curses 초기화 ---
    curses.curs_set(0)  # 커서 숨기기
    curses.start_color()  # 색상 기능 활성화
    curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_CYAN)   # 메뉴 선택 강조 색
    curses.init_pair(2, curses.COLOR_BLACK, curses.COLOR_WHITE)  # 메뉴 비선택 색

    # progress_bar 색상 초기화: 녹색, 노랑, 빨강
    curses.init_pair(3, curses.COLOR_GREEN, curses.COLOR_BLACK)   # 진행률 60% 이하: 녹색
    curses.init_pair(4, curses.COLOR_YELLOW, curses.COLOR_BLACK)  # 진행률 60~80%: 노랑
    curses.init_pair(5, curses.COLOR_RED, curses.COLOR_BLACK)     # 진행률 80% 초과: 빨강

    stdscr.timeout(100)  # 키 입력 대기시간 100ms 설정

    offset_x = 1  # 전체 테이블 좌측 여백

    # 왼쪽 메뉴 항목 리스트
    left_menu = [
        "Virtual Machine",
        "Data Center",
        "Cluster",
        "Host",
        "Network",
        "Storage Domain",
        "Disk",
        "User",
        "Certificate",
        "Events"
    ]

    selected_index = 0  # 현재 선택된 메뉴 인덱스 (기본 0번)

    # 테이블 전체 폭 및 열 폭 설정
    table_width = 121
    left_col_width = 22  # 왼쪽 열 폭
    right_col_width = table_width - left_col_width - 3  # 오른쪽 열 폭 (95)
    combined_left_width = 48  # 상세 테이블 좌측 폭
    combined_right_width = right_col_width - combined_left_width  # 상세 테이블 우측 폭

    # 시스템 서비스 객체 가져오기
    system_service = connection.system_service()

    # --- 새로고침된 데이터(테이블 행)를 저장할 공유 변수 ---
    data_lock = threading.Lock()  # 멀티스레드 안전 보장용 Lock
    cached_table_rows = []        # 테이블에 표시할 캐시된 데이터
    cached_right_width = right_col_width  # 오른쪽 열 고정폭 저장

    # 진행률 바를 문자열 조각(segments)으로 생성하는 내부 함수
    def progress_bar(percentage, width):
        """
        percentage: 현재 사용률(%)
        width: 진행률 바 전체 폭
        """
        filled = min(width, int((percentage / 100) * width))  # 채워야 할 칸 수 계산

        # 녹색, 노랑, 빨강으로 나누는 기준 설정
        green_threshold = int(0.6 * width)   # 60%까지 녹색
        yellow_threshold = int(0.8 * width)  # 80%까지 노랑

        green_filled = min(filled, green_threshold)  # 녹색 영역 칸 수
        yellow_filled = min(max(filled - green_threshold, 0), yellow_threshold - green_threshold)  # 노랑 영역 칸 수
        red_filled = max(filled - yellow_threshold, 0)  # 빨강 영역 칸 수

        # 진행률 바를 구성하는 조각 리스트 생성
        segments = [
            ("[", None),  # 진행률 바 시작
            ("■" * green_filled, curses.color_pair(3)),  # 녹색 영역
            ("■" * yellow_filled, curses.color_pair(4)),  # 노랑 영역
            ("■" * red_filled, curses.color_pair(5)),     # 빨강 영역
            (" " * (width - filled), None),  # 남은 빈 칸
            ("]", None)  # 진행률 바 종료
        ]
        return segments

    def pb_tuple(name, usage):
        """
        주어진 이름(name)과 사용률(usage)을 기반으로
        - 이름을 표시할 문자열(prefix)
        - 진행률 바 문자열(segs)
        - 사용률 표시 문자열(suffix)
        를 튜플 형태로 반환
        이름이 긴 경우 글자 폭을 고려하여 잘라서 표시
        """
        # name이 앞에 공백이 있으면 제거한 base_name 사용
        base_name = name[1:] if name.startswith(" ") else name
    
        # base_name의 표시 너비를 계산
        # (F, W 폭은 2칸, 그 외는 1칸으로 계산)
        disp = sum(2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1 for c in base_name)
    
        # 표시 너비가 19 이상이면 이름을 잘라야 함
        if disp >= 19:
            truncated = ""  # 잘라낸 이름 저장
            current = 0     # 현재까지의 표시 너비
            for char in base_name:
                char_w = 2 if unicodedata.east_asian_width(char) in ('F', 'W') else 1
                if current + char_w > 16:
                    break  # 16칸 넘어가면 중단
                truncated += char
                current += char_w
            display_name = " " + truncated + ".."  # 잘린 이름 뒤에 .. 붙임
        else:
            # 표시 너비가 짧으면 원래 이름 사용
            display_name = name
        # 사용률에 따른 진행률 바 문자열 생성 (길이 20칸)
        segs = progress_bar(usage, 20)
        # 이름(prefix)을 좌측 정렬(20칸)
        prefix = f"{display_name:<20}"
        # 사용률(suffix)을 소수점 없이 정수로 표시
        suffix = f" {usage:.0f}%"
        # (prefix, progress bar, suffix) 튜플로 반환
        return (prefix, segs, suffix)

    # --- Updated load_data function using concurrency ---
    def load_data():
        try:
            # 병렬로 API 호출 (storage domains, clusters, hosts, VMs, disks, events)
            with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
                # 각 API 호출을 비동기로 실행
                future_sd = executor.submit(lambda: system_service.storage_domains_service().list())
                future_clusters = executor.submit(lambda: system_service.clusters_service().list())
                future_hosts = executor.submit(lambda: system_service.hosts_service().list())
                future_vms = executor.submit(lambda: system_service.vms_service().list())
                future_disks = executor.submit(lambda: system_service.disks_service().list())
                future_events = executor.submit(lambda: system_service.events_service().list(max=8))

                # 결과를 가져올 때 예외 처리하여 실패 시 빈 리스트 반환
                try:
                    storage_domains_list = future_sd.result(timeout=10)
                except Exception:
                    storage_domains_list = []

                try:
                    clusters = future_clusters.result(timeout=10)
                except Exception:
                    clusters = []

                try:
                    hosts = future_hosts.result(timeout=10)
                except Exception:
                    hosts = []

                try:
                    vms = future_vms.result(timeout=10)
                except Exception:
                    vms = []

                try:
                    disks = future_disks.result(timeout=10)
                except Exception:
                    disks = []

                try:
                    ovirt_events = future_events.result(timeout=10)
                except Exception:
                    ovirt_events = []

            # 가져온 데이터로 각종 개수 집계
            storage_domain_count = len(storage_domains_list) if storage_domains_list is not None else "N/A"
            cluster_count = len(clusters) if clusters is not None else "N/A"

            # 호스트 상태(up/down) 개수 집계
            up_count = sum(1 for host in hosts if str(host.status).lower() == "up") if hosts is not None else "N/A"
            down_count = sum(1 for host in hosts if str(host.status).lower() == "down") if hosts is not None else "N/A"

            # VM 상태(up/down) 개수 집계
            vm_up_count = sum(1 for vm in vms if str(vm.status).lower() == "up") if vms is not None else "N/A"
            vm_down_count = sum(1 for vm in vms if str(vm.status).lower() == "down") if vms is not None else "N/A"

            # 디스크 수 집계
            storage_disk_count = len(disks) if disks is not None else "N/A"

            # CPU 사용량 계산
            total_cpu_cores = 0
            if hosts:
                for host in hosts:
                    if hasattr(host, 'cpu') and host.cpu and hasattr(host.cpu, 'topology') and host.cpu.topology:
#                        total_cpu_cores += host.cpu.topology.cores * host.cpu.topology.sockets    # 하이퍼쓰레딩 미적용
                        total_cpu_cores += (
                            host.cpu.topology.sockets * host.cpu.topology.cores * host.cpu.topology.threads
                            if hasattr(host.cpu.topology, "threads") and host.cpu.topology.threads
                            else host.cpu.topology.sockets * host.cpu.topology.cores
                        )
            used_cpu_cores = 0
            if vms:
                for vm in vms:
                    if vm.status and str(vm.status).lower() == "up":
                        if hasattr(vm, 'cpu') and vm.cpu and hasattr(vm.cpu, 'topology') and vm.cpu.topology:
                            used_cpu_cores += vm.cpu.topology.cores * vm.cpu.topology.sockets
            try:
                cpu_usage_percentage = (used_cpu_cores / total_cpu_cores) * 100 if total_cpu_cores else 0
            except:
                cpu_usage_percentage = 0
            cpu_free_percentage = 100 - cpu_usage_percentage

            # Memory 사용량 계산
            total_memory_bytes = 0
            if hosts:
                # 모든 호스트의 총 메모리 합산
                for host in hosts:
                    if hasattr(host, 'memory') and host.memory is not None:
                        total_memory_bytes += int(host.memory)

            used_memory_bytes = 0
            if vms:
                # 실행 중(Up)인 VM들의 메모리 합산
                for vm in vms:
                    if vm.status and str(vm.status).lower() == "up" and hasattr(vm, 'memory') and vm.memory is not None:
                        used_memory_bytes += int(vm.memory)

            # 총 메모리(GB) 및 사용 메모리(GB) 계산
            total_memory_gb = total_memory_bytes / (1024**3) if total_memory_bytes else 0
            used_memory_gb = used_memory_bytes / (1024**3) if used_memory_bytes else 0

            # 총 메모리 및 사용 메모리 포맷 (소수점 없이)
            total_memory_formatted = f"{total_memory_gb:.0f}" if total_memory_gb else "N/A"
            used_memory_formatted = f"{used_memory_gb:.0f}" if used_memory_gb else "N/A"

            try:
                # 메모리 사용률(%) 계산
                mem_usage_percentage = (used_memory_gb / total_memory_gb) * 100 if total_memory_gb > 0 else 0
            except:
                mem_usage_percentage = 0

            # 메모리 여유율(%) 계산
            mem_free_percentage = 100 - mem_usage_percentage

            # Storage 사용량 계산
            total_storage_bytes = 0
            used_storage_bytes = 0

            if storage_domains_list:
                # 모든 스토리지 도메인의 총용량/사용용량 합산
                for sd in storage_domains_list:
                    if hasattr(sd, 'statistics') and sd.statistics is not None:
                        try:
                            # statistics 객체에서 used/total 추출
                            used_val = int(sd.statistics.used) if sd.statistics.used is not None else 0
                            total_val = int(sd.statistics.total) if sd.statistics.total is not None else 0
                        except:
                            # 값 파싱 실패 시 0으로 처리
                            used_val = 0
                            total_val = 0
                    else:
                        # fallback: 속성에서 직접 used, available 추출
                        used_val = int(getattr(sd, 'used', 0) or 0)
                        available = int(getattr(sd, 'available', 0) or 0)
                        total_val = used_val + available

                    total_storage_bytes += total_val
                    used_storage_bytes += used_val

            # 총 스토리지(TB) 및 사용 스토리지(TB) 계산
            total_storage_tb = total_storage_bytes / (1024**4) if total_storage_bytes else 0
            used_storage_tb = used_storage_bytes / (1024**4) if used_storage_bytes else 0

            # 총 스토리지 및 사용 스토리지 포맷 (소수점 첫째 자리)
            total_storage_formatted = f"{total_storage_tb:.1f}" if total_storage_tb else "N/A"
            used_storage_formatted = f"{used_storage_tb:.1f}" if used_storage_tb else "N/A"

            try:
                # 스토리지 사용률(%) 계산
                storage_usage_percentage = (used_storage_tb / total_storage_tb) * 100 if total_storage_tb > 0 else 0
            except:
                storage_usage_percentage = 0

            # 스토리지 여유율(%) 계산
            storage_free_percentage = 100 - storage_usage_percentage

            # Event 총 수 계산
            event_count = len(ovirt_events) if ovirt_events is not None else "N/A"

            # progress_bar 생성
            cpu_progress_bar_segments = progress_bar(cpu_usage_percentage, 20)       # CPU 사용률에 대한 진행률 바 생성
            mem_progress_bar_segments = progress_bar(mem_usage_percentage, 20)       # 메모리 사용률에 대한 진행률 바 생성
            storage_progress_bar_segments = progress_bar(storage_usage_percentage, 20)  # 스토리지 사용률에 대한 진행률 바 생성

            # CPU 사용량 텍스트 생성 및 고정 폭 처리
            fixed_cpu_prefix_width = 68  # CPU/Mem/Storage 공통으로 좌측 설명폭 고정
            cpu_prefix = f" CPU     : {used_cpu_cores}/{total_cpu_cores} cores ({cpu_free_percentage:.1f}% Free)"  # CPU 설명 문자열
            cpu_prefix_fixed = get_display_width(cpu_prefix, fixed_cpu_prefix_width)  # 고정 폭에 맞게 패딩 추가
            cpu_row = ("progress", cpu_prefix_fixed, cpu_progress_bar_segments, f" {cpu_usage_percentage:.0f}%")  # CPU 행 구성

            # 메모리 사용량 텍스트 생성 및 고정 폭 처리
            mem_prefix = f" Memory  : {used_memory_formatted}/{total_memory_formatted} GB ({mem_free_percentage:.1f}% Free)"  # 메모리 설명 문자열
            mem_prefix_fixed = get_display_width(mem_prefix, fixed_cpu_prefix_width)  # 고정 폭에 맞게 패딩 추가
            mem_row = ("progress", mem_prefix_fixed, mem_progress_bar_segments, f" {mem_usage_percentage:.0f}%")  # 메모리 행 구성

            # 스토리지 사용량 텍스트 생성 및 고정 폭 처리
            storage_prefix = f" Storage : {used_storage_formatted}/{total_storage_formatted} TB ({storage_free_percentage:.1f}% Free)"  # 스토리지 설명 문자열
            storage_prefix_fixed = get_display_width(storage_prefix, fixed_cpu_prefix_width)  # 고정 폭에 맞게 패딩 추가
            storage_row = ("progress", storage_prefix_fixed, storage_progress_bar_segments, f" {storage_usage_percentage:.0f}%")  # 스토리지 행 구성

            # 오른쪽 패널 라인 생성

            # [1] 첫 번째 줄: Storage Domain, Cluster, Host 상태 요약
            left_segment_1 = get_display_width(f" Storage Domain: {storage_domain_count}", 35)  # 스토리지 도메인 수
            middle_segment_1 = get_display_width(f"Cluster: {cluster_count}", 32)                # 클러스터 수

            host_str = (
                "host_line",  # 식별용 태그
                (get_display_width(f" □ Storage Domain: {storage_domain_count}", 35), None),
                (get_display_width(f"□ Cluster: {cluster_count}", 32), None),
                ("□ Host: ", None),
                ("▲", curses.color_pair(3)), (str(up_count), None),
                ("/", None),
                ("▼", curses.color_pair(5)), (str(down_count), None)
            )

            # [2] 두 번째 줄: VM 상태 + Disk + Event 수
            vm_left_segments = [
                (" □ VM: ", None),
                ("▲", curses.color_pair(3)), (str(vm_up_count), None),
                ("/", None),
                ("▼", curses.color_pair(5)), (str(vm_down_count), None)
            ]

            # VM 상태 표시 문자열 길이 맞추기 (공백 추가)    
            plain_vm_left = "".join([seg[0] for seg in vm_left_segments])
            pad_len = 35 - len(plain_vm_left)
            if pad_len > 0:
                vm_left_segments.append((" " * pad_len, None))
            middle_segment_2 = get_display_width(f"□ Disk: {storage_disk_count}", 32)
            event_str = f"□ Event: {event_count}"
            line_2 = ("vm_line",) + tuple(vm_left_segments) + ((middle_segment_2, None), (event_str, None))
            
            # [3] 세 번째 줄: CPU, Memory, Storage 사용량 요약
            left_segment_3 = get_display_width(f" □ CPU(cores): {used_cpu_cores}/{total_cpu_cores}", 35)
            middle_segment_3 = get_display_width(f"□ Memory(GB): {used_memory_formatted}/{total_memory_formatted}", 32)
            storage_str = f"□ Storage(TB): {used_storage_formatted}/{total_storage_formatted}"
            line_3 = left_segment_3 + middle_segment_3 + storage_str
            
            # [4] 오른쪽 화면에 표시할 전체 라인 리스트
            lines_right = [
                "",  # 빈 줄
                host_str,    # 첫 번째 줄: Host 상태
                line_2,      # 두 번째 줄: VM + Disk + Events
                line_3,      # 세 번째 줄: CPU + Memory + Storage
                "",          # 빈 줄
                "HLINE",     # 구분선
                "",          # 빈 줄
                " □ Total usage",  # 전체 사용량 섹션 타이틀
                cpu_row,         # CPU 진행률 표시
                mem_row,         # 메모리 진행률 표시
                storage_row,     # 스토리지 진행률 표시
                "",          # 빈 줄
                "HLINE",     # 구분선
                "",          # 빈 줄
                " □ VM Top 3 usage",  # VM 상위 3개 사용량
                (" " + "VM CPU".ljust(24) + " " * 24 + "VM Memory"),  # VM 사용량 헤더
                " placeholder_vm1",  # VM1 자리
                " placeholder_vm2",  # VM2 자리
                " placeholder_vm3",  # VM3 자리
                "",          # 빈 줄
                "HLINE",     # 구분선
                "",          # 빈 줄
                " □ Host Top 3 usage",  # 호스트 상위 3개 사용량
                (" " + "Host CPU".ljust(24) + " " * 24 + "Host Memory"),  # 호스트 사용량 헤더
                " placeholder_host1",  # 호스트1 자리
                " placeholder_host2",  # 호스트2 자리
                " placeholder_host3",  # 호스트3 자리
                "",          # 빈 줄
                "HLINE",     # 구분선
                "",          # 빈 줄
                " " * 1 + "□ Events"  # 이벤트 섹션 타이틀
            ]

            # --- (C) VM Top 3 CPU / Memory ---

            # VM 하나에 대해 CPU, 메모리 사용량을 가져오는 함수
            def fetch_vm_stats(vm):
                cpu_usage = 0.0
                used_mem_bytes = 0.0
                try:
                    # VM 통계 서비스 연결
                    stat_service = system_service.vms_service().vm_service(vm.id).statistics_service()
                    stats = stat_service.list()
                    for stat in stats:
                        if stat.name == "cpu.usage.history":
                            if stat.values:
                                # 가장 최신 값을 가져오기
                                if hasattr(stat.values[0], "time"):
                                    most_recent_value = max(stat.values, key=lambda v: v.time)
                                else:
                                    most_recent_value = stat.values[0]
                                if most_recent_value.datum is not None:
                                    cpu_usage = float(most_recent_value.datum)
                        elif stat.name == "memory.used":
                            if stat.values and stat.values[0].datum is not None:
                                used_mem_bytes = float(stat.values[0].datum)
                    total_mem = float(vm.memory) if vm.memory else 0.0
                    return (vm.name, cpu_usage, used_mem_bytes, total_mem)
                except:
                    # 오류 발생 시 기본값 반환
                    total_mem = float(vm.memory) if vm.memory else 0.0
                    return (vm.name, 0.0, 0.0, total_mem)

            top_vms_cpu = []
            top_vms_mem = []

            # VM 사용량 가져오기 (병렬 처리)
            with concurrent.futures.ThreadPoolExecutor(max_workers=10) as vm_executor:
                futures_vm = {
                    vm_executor.submit(fetch_vm_stats, vm): vm 
                    for vm in vms if vm.status and str(vm.status).lower() == "up" and vm.name != "HostedEngine"
                }
                for future in concurrent.futures.as_completed(futures_vm):
                    name, cpu_usage, used_mem, total_mem = future.result()
                    top_vms_cpu.append((name, cpu_usage))
                    mem_percent = (used_mem / total_mem * 100) if total_mem > 0 else 0.0
                    top_vms_mem.append((name, mem_percent))

            # CPU 사용량, 메모리 사용량 기준으로 각각 정렬
            top_vms_cpu.sort(key=lambda x: x[1], reverse=True)
            top_vms_mem.sort(key=lambda x: x[1], reverse=True)

            # 상위 3개만 추출
            top3_cpu = top_vms_cpu[:3]
            top3_mem = top_vms_mem[:3]

            # VM 통합 표시 행 생성
            vm_combined_rows = []
            for i in range(3):
                if i < len(top3_cpu):
                    cpu_name, cpu_usage = top3_cpu[i]
                    left_progress = pb_tuple(" " + cpu_name, cpu_usage)
                else:
                    left_progress = pb_tuple(" -", 0.0)

                if i < len(top3_mem):
                    mem_name, mem_usage = top3_mem[i]
                    right_progress = pb_tuple(" " + mem_name, mem_usage)
                else:
                    right_progress = pb_tuple(" -", 0.0)

                combined_vm_row = ("combined_progress", left_progress, right_progress)
                vm_combined_rows.append(combined_vm_row)

            # VM Top 3 영역에 데이터 반영
            try:
                # " □ VM Top 3 usage" 라인 번호를 찾아서 그 아래 3줄을 덮어쓴다
                start_index_vm = lines_right.index(" □ VM Top 3 usage")
                lines_right[start_index_vm + 2 : start_index_vm + 2 + len(vm_combined_rows)] = vm_combined_rows
            except ValueError:
                pass

            # --- (D) Host Top 3 CPU / Memory ---

            # 호스트 하나에 대해 CPU, 메모리 사용량을 가져오는 함수
            def fetch_host_stats(host):
                cpu_usage = 0.0
                mem_percent = 0.0
                try:
                    # 호스트 통계 서비스 연결
                    host_stat_service = system_service.hosts_service().host_service(host.id).statistics_service()
                    host_stats = host_stat_service.list()
                    idle_val = 0.0
                    mem_used = None
                    mem_total = None

                    for hstat in host_stats:
                        if hstat.name == "cpu.current.idle":
                            if hstat.values and hstat.values[0].datum is not None:
                                idle_val = float(hstat.values[0].datum)
                                if idle_val <= 1.0:
                                    idle_val *= 100.0
                                cpu_usage = 100.0 - idle_val  # idle 기준으로 사용률 계산
                        elif 'memory.used' in hstat.name.lower() and hstat.values and hstat.values[0].datum is not None:
                            mem_used = float(hstat.values[0].datum)
                        elif 'memory.total' in hstat.name.lower() and hstat.values and hstat.values[0].datum is not None:
                            mem_total = float(hstat.values[0].datum)

                    if mem_used is not None and mem_total and mem_total > 0:
                        mem_percent = round((mem_used / mem_total) * 100, 1)

                    return (host.name, cpu_usage, mem_percent)
                except:
                    # 오류 발생 시 기본값 반환
                    return (host.name, 0.0, 0.0)

            top_hosts_cpu = []
            top_hosts_mem = []

            # Host 사용량 가져오기 (병렬 처리)
            with concurrent.futures.ThreadPoolExecutor(max_workers=10) as host_executor:
                futures_host = {
                    host_executor.submit(fetch_host_stats, host): host 
                    for host in hosts if str(host.status).lower() == "up"
                }
                for future in concurrent.futures.as_completed(futures_host):
                    name, cpu_usage, mem_percent = future.result()
                    top_hosts_cpu.append((name, cpu_usage))
                    top_hosts_mem.append((name, mem_percent))

            # CPU 사용량, 메모리 사용량 기준으로 각각 정렬
            top_hosts_cpu.sort(key=lambda x: x[1], reverse=True)
            top_hosts_mem.sort(key=lambda x: x[1], reverse=True)

            # 상위 3개만 추출
            top3_host_cpu = top_hosts_cpu[:3]
            top3_host_mem = top_hosts_mem[:3]

            # Host 통합 표시 행 생성
            host_combined_rows = []
            for i in range(3):
                if i < len(top3_host_cpu):
                    cpu_name, cpu_usage = top3_host_cpu[i]
                    left_progress = pb_tuple(" " + cpu_name, cpu_usage)
                else:
                    left_progress = pb_tuple(" -", 0.0)

                if i < len(top3_host_mem):
                    mem_name, mem_usage = top3_host_mem[i]
                    right_progress = pb_tuple(" " + mem_name, mem_usage)
                else:
                    right_progress = pb_tuple(" -", 0.0)

                combined_host_row = ("combined_progress", left_progress, right_progress)
                host_combined_rows.append(combined_host_row)

            # Host Top 3 영역에 데이터 반영
            try:
                start_index_host = lines_right.index(" □ Host Top 3 usage")
                lines_right[start_index_host + 2 : start_index_host + 2 + len(host_combined_rows)] = host_combined_rows
            except ValueError:
                pass

            # --- 이벤트 표시 (최대 8개) ---
            if ovirt_events:
                for event in ovirt_events:
                    try:
                        if isinstance(event.time, datetime):
                            event_time = event.time
                        else:
                            # 문자열을 datetime으로 파싱 시도
                            try:
                                event_time = datetime.strptime(event.time, "%Y-%m-%dT%H:%M:%S.%fZ")
                            except Exception:
                                try:
                                    event_time = datetime.strptime(event.time, "%Y-%m-%dT%H:%M:%SZ")
                                except Exception:
                                    event_time = None
                        formatted_time = event_time.strftime("%Y.%-m.%-d. %p %-I:%M:%S") if event_time else "N/A"
                    except:
                        formatted_time = "N/A"

                    # 시간 + 이벤트 설명 조합하여 표시
                    formatted_event = f"{formatted_time} {event.description}"
                    ovr = " " + get_display_width(formatted_event, cached_right_width - 1)
                    lines_right.append(ovr)
            lines_right.append("")

            # --- 테이블 행(table_rows) 생성 ---
            table_rows = []
            num_rows = max(len(left_menu), len(lines_right))  # 좌측 메뉴 수와 우측 데이터 수 중 더 큰 값
            for i in range(num_rows):
                if i < len(left_menu):
                    left_text = " " + left_menu[i]
                else:
                    left_text = ""
                left_cell = left_text.ljust(left_col_width)

                if i < len(lines_right):
                    item = lines_right[i]
                    if isinstance(item, str):
                        right_cell = item.ljust(cached_right_width)
                    else:
                        right_cell = item
                else:
                    right_cell = ""

                table_rows.append((left_cell, right_cell))
            return table_rows

        except Exception as e:
            return []

    # --- 동기적 초기 데이터 로드 ---
    with data_lock:
        cached_table_rows = load_data()

    # --- 백그라운드 스레드: 주기적으로 데이터 새로고침 ---
    def refresh_data():
        nonlocal cached_table_rows, cached_right_width
        while True:
            try:
                new_data = load_data()
                with data_lock:
                    cached_table_rows = new_data
            except Exception as e:
                pass
            time.sleep(5)

    refresh_thread = threading.Thread(target=refresh_data, daemon=True)
    refresh_thread.start()

    # --- 메인 루프: 사용자 입력 및 화면 그리기 ---
    while True:
        stdscr.erase()
        height, width = stdscr.getmaxyx()

        # 터미널 크기 확인
        if width < table_width + offset_x or height < 45:
            stdscr.addstr(0, offset_x, f"Terminal too small. Resize to at least {table_width}x50.", curses.A_BOLD)
            stdscr.refresh()
            stdscr.getch()
            continue

        # 상단 제목 출력
        stdscr.addstr(1, offset_x, "■ RutilVM Assistor", curses.A_BOLD)
        top_border = "┌" + "─" * left_col_width + "┬" + "─" * cached_right_width + "┐"
        stdscr.addstr(2, offset_x, top_border)

        # 테이블 데이터 가져오기
        with data_lock:
            table_rows = list(cached_table_rows)

        current_y = 2
        for idx, (lcell, rcell) in enumerate(table_rows):
            current_y += 1
            stdscr.addstr(current_y, offset_x, "│")

            # 왼쪽 메뉴 출력 (선택 항목은 강조)
            if idx < len(left_menu) and idx == selected_index:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(current_y, offset_x + 1, lcell[:left_col_width])
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(current_y, offset_x + 1, lcell[:left_col_width])

            # 오른쪽 패널 출력
            if isinstance(rcell, str) and rcell.strip() == "HLINE":
                # 구분선 표시
                stdscr.addstr(current_y, offset_x + left_col_width + 1, "├" + "─" * cached_right_width + "┤")
            elif isinstance(rcell, tuple) and rcell[0] == "progress":
                # Progress bar 타입
                prefix = rcell[1]
                segments = rcell[2]
                suffix = rcell[3]
                x_pos = offset_x + left_col_width + 2
                max_x = offset_x + left_col_width + 2 + cached_right_width

                stdscr.addstr(current_y, offset_x + left_col_width + 1, "│")
                stdscr.addstr(current_y, x_pos, prefix[:cached_right_width])
                x_pos += len(prefix[:cached_right_width])

                for text, attr in segments:
                    if x_pos + len(text) > max_x:
                        text = text[:max_x - x_pos]
                    if attr:
                        stdscr.addstr(current_y, x_pos, text, attr)
                    else:
                        stdscr.addstr(current_y, x_pos, text)
                    x_pos += len(text)

                if x_pos < max_x:
                    stdscr.addstr(current_y, x_pos, suffix[:max_x - x_pos])

                stdscr.addstr(current_y, offset_x + left_col_width + 2 + cached_right_width, "│")

            elif isinstance(rcell, tuple) and rcell[0] in ("host_line", "vm_line"):
                # Host/VM 요약 줄
                x_pos = offset_x + left_col_width + 2
                max_x = offset_x + left_col_width + 2 + cached_right_width
                stdscr.addstr(current_y, offset_x + left_col_width + 1, "│")

                for segment in rcell[1:]:
                    text, attr = segment
                    if x_pos + len(text) > max_x:
                        text = text[:max_x - x_pos]
                    if attr:
                        stdscr.addstr(current_y, x_pos, text, attr)
                    else:
                        stdscr.addstr(current_y, x_pos, text)
                    x_pos += len(text)

                stdscr.addstr(current_y, offset_x + left_col_width + 2 + cached_right_width, "│")

            elif isinstance(rcell, tuple) and rcell[0] == "combined_progress":
                # VM/Host Top 3 사용량 표시
                left_progress = rcell[1]
                right_progress = rcell[2]

                x_pos = offset_x + left_col_width + 2
                max_x_left = x_pos + combined_left_width

                # 왼쪽(예: CPU 사용량)
                prefix, segments, suffix = left_progress
                stdscr.addstr(current_y, offset_x + left_col_width + 1, "│")
                stdscr.addstr(current_y, x_pos, prefix[:combined_left_width])
                x_pos += len(prefix[:combined_left_width])

                for text, attr in segments:
                    if x_pos + len(text) > max_x_left:
                        text = text[:max_x_left - x_pos]
                    if attr:
                        stdscr.addstr(current_y, x_pos, text, attr)
                    else:
                        stdscr.addstr(current_y, x_pos, text)
                    x_pos += len(text)

                if x_pos < max_x_left:
                    stdscr.addstr(current_y, x_pos, suffix[:max_x_left - x_pos])

                # 오른쪽(예: Memory 사용량)
                x_pos = offset_x + left_col_width + 2 + combined_left_width
                max_x_right = offset_x + left_col_width + 2 + cached_right_width
                prefix, segments, suffix = right_progress
                stdscr.addstr(current_y, x_pos, prefix[:combined_right_width])
                x_pos += len(prefix[:combined_right_width])

                for text, attr in segments:
                    if x_pos + len(text) > max_x_right:
                        text = text[:max_x_right - x_pos]
                    if attr:
                        stdscr.addstr(current_y, x_pos, text, attr)
                    else:
                        stdscr.addstr(current_y, x_pos, text)
                    x_pos += len(text)

                if x_pos < max_x_right:
                    stdscr.addstr(current_y, x_pos, suffix[:max_x_right - x_pos])

                stdscr.addstr(current_y, offset_x + left_col_width + 2 + cached_right_width, "│")

            else:
                # 기본 문자열 출력
                stdscr.addstr(current_y, offset_x + left_col_width + 1, "│")
                stdscr.addstr(current_y, offset_x + left_col_width + 2, str(rcell)[:cached_right_width])
                stdscr.addstr(current_y, offset_x + left_col_width + 2 + cached_right_width, "│")

        # 하단 테두리 출력
        bottom_border = "└" + "─" * left_col_width + "┴" + "─" * cached_right_width + "┘"
        stdscr.addstr(current_y + 1, offset_x, bottom_border)

        # 하단 네비게이션 텍스트 출력
        nav_text_left = "▲/▼=Navigate | ENTER=Select"
        nav_text_right = "Q=Quit"
        stdscr.addstr(height - 1, offset_x, nav_text_left)
        x_quit = table_width + offset_x - len(nav_text_right)
        if x_quit < 0:
            x_quit = 0
        stdscr.addstr(height - 1, x_quit, nav_text_right)

        stdscr.refresh()

        # 키 입력 처리
        key = stdscr.getch()
        if key == curses.KEY_UP:
            selected_index = (selected_index - 1) % len(left_menu)
        elif key == curses.KEY_DOWN:
            selected_index = (selected_index + 1) % len(left_menu)
        elif key == 10:  # ENTER key
            menu_name = left_menu[selected_index]
            if menu_name == "Virtual Machine":
                show_virtual_machines(stdscr, connection)
            elif menu_name == "Data Center":
                show_data_centers(stdscr, connection)
            elif menu_name == "Cluster":
                show_clusters(stdscr, connection)
            elif menu_name == "Host":
                show_hosts(stdscr, connection)
            elif menu_name == "Network":
                show_networks(stdscr, connection)
            elif menu_name == "Storage Domain":
                show_storage_domains(stdscr, connection)
            elif menu_name == "Disk":
                show_storage_disks(stdscr, connection)
            elif menu_name == "User":
                show_users(stdscr, connection)
            elif menu_name == "Certificate":
                show_certificates(stdscr, connection)
            elif menu_name == "Events":
                show_events(stdscr, connection)
        elif key in (ord('q'), ord('Q')):
            break

# =============================================================================
# Section 4: Virtual Machine Section
# =============================================================================
def confirm_suspend_popup(stdscr, vm_name):
    """
    VM을 Suspend(일시 중지)할 것인지 확인하는 팝업 창 표시
    """
    # 터미널 크기 가져오기
    height, width = stdscr.getmaxyx()

    # 팝업 창 크기 설정 (최대 12x60, 터미널 크기 초과 방지)
    popup_height = min(12, height - 2)
    popup_width = min(60, width - 4)

    # 팝업 창 위치 설정 (화면 중앙)
    popup_y = max(0, (height - popup_height) // 2)
    popup_x = max(0, (width - popup_width) // 2)

    # 팝업 창 생성
    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)  # 방향키 입력 가능하게 설정

    # 선택지 목록과 현재 선택 인덱스 초기화
    options = ["Yes", "No"]
    current_option = 0

    while True:
        # 화면 지우고 테두리 다시 그림
        popup.erase()
        popup.border()

        # 제목과 VM 이름 표시
        title = "Are you sure you want to suspend?"
        vm_text = f"{vm_name}"
        popup.addstr(2, (popup_width - len(title)) // 2, title, curses.A_BOLD)
        popup.addstr(5, (popup_width - len(vm_text)) // 2, vm_text)

        # 버튼 위치 계산
        yes_x = (popup_width // 2) - 8
        no_x = (popup_width // 2) + 4
        button_y = 8

        # "Yes" 버튼 출력 (선택되었으면 강조 표시)
        popup.addstr(
            button_y, yes_x - 1,
            "[ Yes ]" if current_option == 0 else "  Yes  ",
            curses.A_BOLD if current_option == 0 else curses.A_NORMAL
        )

        # "No" 버튼 출력 (선택되었으면 강조 표시)
        popup.addstr(
            button_y, no_x - 1,
            "[ No ]" if current_option == 1 else "  No  ",
            curses.A_BOLD if current_option == 1 else curses.A_NORMAL
        )

        # 조작 방법 안내 출력
        instructions = "◀/▶: Move | ENTER: Select"
        popup.addstr(popup_height - 2, (popup_width - len(instructions)) // 2, instructions, curses.A_DIM)

        # 팝업 화면 갱신
        popup.refresh()

        # 사용자 키 입력 받기
        key = popup.getch()

        if key in [curses.KEY_LEFT, curses.KEY_RIGHT]:
            # 좌우 방향키로 선택 이동
            current_option = 1 - current_option
        elif key == 10:  # ENTER 키
            # 선택된 옵션 반환 ("Yes" 선택 시 True 반환)
            return options[current_option] == "Yes"
        elif key == 27:  # ESC 키
            # ESC 입력 시 무조건 False 반환 (취소)
            return False

def show_virtual_machines(stdscr, connection):
    init_curses_colors()  # 공통 curses 색상 초기화 함수

    """
    Virtual Machine 목록과 HOST Resource usage 테이블을 모두 표시함
    """
    # 현재 터미널 크기 가져오기
    height, width = stdscr.getmaxyx()

    rows_per_page = 24  # 한 페이지에 표시할 VM 행 수
    vm_global_index = 0  # 전체 VM 리스트 내 전역 선택 인덱스

    host_rows_per_page = 4  # 한 페이지에 표시할 Host 행 수
    host_global_index = 0   # 전체 Host 리스트 내 전역 선택 인덱스

    focus = 0  # 현재 포커스 (0 = VM List, 1 = HOST Resource usage)

    selected_vms = set()         # 스페이스바로 선택된 VM 인덱스 집합
    pending_start_vms = set()    # 시작 예약된 VM 인덱스 집합

    vm_poll_interval = 1.0        # VM 정보 갱신 주기 (초 단위)
    host_poll_interval = 1.0      # Host 정보 갱신 주기 (초 단위)

    try:
        # oVirt API 서비스 객체 가져오기
        vms_service = connection.system_service().vms_service()  # VM 서비스
        hosts_service = connection.system_service().hosts_service()  # Host 서비스
        hosts = hosts_service.list()  # 모든 Host 리스트 가져오기
        hosts_map = {host.id: host.name for host in hosts}  # host.id -> host.name 매핑 딕셔너리

        vms = vms_service.list()  # 모든 VM 리스트 가져오기

        clusters_service = connection.system_service().clusters_service()  # 클러스터 서비스
        clusters = clusters_service.list()  # 모든 클러스터 리스트 가져오기
        clusters_map = {cl.id: cl for cl in clusters}  # cluster.id -> cluster 객체 매핑

        try:
            # 데이터센터 서비스 가져오기
            data_centers_service = connection.system_service().data_centers_service()
            data_centers = data_centers_service.list()  # 데이터센터 리스트 가져오기
            data_centers_map = {dc.id: dc.name for dc in data_centers}  # 데이터센터 id -> 이름 매핑
        except Exception:
            # 데이터센터 가져오기 실패 시 빈 딕셔너리
            data_centers_map = {}

    except Exception as e:
        # 위 API 호출들 중 하나라도 실패하면 오류 메시지 출력 후 종료
        stdscr.addstr(7, 1, f"Failed to fetch VM data: {e}", curses.color_pair(4))
        stdscr.refresh()
        stdscr.getch()
        return

    vm_lock = threading.Lock()  # VM 리스트 업데이트 시 쓰레드 동기화를 위한 Lock

    stdscr.timeout(10)  # curses 키 입력 폴링 주기를 10ms로 설정

    # --- 내부 함수 정의 ---

    # VM 객체로부터 소속된 데이터센터 ID 추출
    def get_dc_id_from_vm(vm):
        if vm.cluster and vm.cluster.id in clusters_map:
            cl = clusters_map[vm.cluster.id]
            if hasattr(cl, 'data_center') and cl.data_center and hasattr(cl.data_center, 'id'):
                return cl.data_center.id
        return None

    # Host 객체로부터 소속된 데이터센터 ID 추출
    def get_dc_id_from_host(host):
        if host.cluster and host.cluster.id in clusters_map:
            cl = clusters_map[host.cluster.id]
            if hasattr(cl, 'data_center') and cl.data_center and hasattr(cl.data_center, 'id'):
                return cl.data_center.id
        return None

    # VM 목록을 주기적으로 새로고침하는 스레드 함수
    def refresh_vms():
        nonlocal vms, pending_start_vms
        while True:
            try:
                new_vms = vms_service.list()
                with vm_lock:
                    vms = new_vms
                    # pending_start_vms에 있던 VM이 정상적으로 기동 완료했는지 확인
                    for vm_index in list(pending_start_vms):
                        current_status = new_vms[vm_index].status.value if new_vms[vm_index].status else "N/A"
                        if current_status not in ["wait for launch", "powering up"]:
                            pending_start_vms.remove(vm_index)
            except Exception:
                pass
            time.sleep(vm_poll_interval)

    # VM 새로고침 스레드 시작
    threading.Thread(target=refresh_vms, daemon=True).start()

    last_host_poll = 0  # 마지막으로 Host 정보를 폴링한 시간

    # --- 메인 화면 루프 ---
    while True:
        now = time.time()
        stdscr.erase()

        # 상단 제목 출력
        stdscr.addstr(1, 1, "■ Virtual Machine", curses.A_BOLD)

        # 현재 VM 목록 가져오기
        with vm_lock:
            current_vms = list(vms)

        total_vm_count = len(current_vms)
        current_vm_page = vm_global_index // rows_per_page
        start_idx = current_vm_page * rows_per_page
        end_idx = min(start_idx + rows_per_page, total_vm_count)

        title = f"- VM List (Total {total_vm_count} VMs)"
        total_pages = (total_vm_count + rows_per_page - 1) // rows_per_page
        vm_page_info = f"{current_vm_page+1}/{total_pages}" if total_pages > 1 else ""

        # 제목줄 출력
        stdscr.addstr(3, 1, title.ljust(121 - len(vm_page_info)) + vm_page_info)

        # 테이블 칼럼 너비 설정
        col_widths = [26, 29, 19, 14, 14, 12]

        # 테이블 상단 테두리 출력
        top_border = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
        stdscr.addstr(4, 1, top_border)

        # 테이블 헤더 출력
        vm_headers = ["VM Name", "Status", "Host", "Data Center", "Cluster", "Uptime"]
        header_row = "│" + "│".join(
            get_display_width(truncate_with_ellipsis(vm_headers[i], col_widths[i]), col_widths[i])
            for i in range(len(vm_headers))
        ) + "│"
        stdscr.addstr(5, 1, header_row)

        # 헤더와 데이터 구분선 출력
        divider_line = "├" + "┼".join("─" * w for w in col_widths) + "┤"
        stdscr.addstr(6, 1, divider_line)

        # --- VM 목록 표시 ---
        for idx, vm in enumerate(current_vms[start_idx:end_idx]):
            global_vm_index = start_idx + idx  # 전체 VM 리스트 기준 인덱스
            is_selected = "[x]" if global_vm_index in selected_vms else "[ ]"  # 스페이스바로 선택 여부 표시

            # VM 기본 정보 추출
            name = f"{is_selected} {vm.name}"
            status = vm.status.value if vm.status else "N/A"

            # 기동 대기 중이면 상태 표시 추가
            if global_vm_index in pending_start_vms:
                status += " (starting...)"

            # 호스트 이름 매핑
            host_name = hosts_map.get(vm.host.id, "N/A") if vm.host else "N/A"

            # 클러스터 및 데이터센터 이름 매핑
            cluster_name = "N/A"
            data_center = "N/A"
            if vm.cluster and vm.cluster.id in clusters_map:
                cl = clusters_map[vm.cluster.id]
                cluster_name = cl.name if getattr(cl, 'name', None) else "N/A"
                if hasattr(cl, 'data_center') and cl.data_center and hasattr(cl.data_center, 'id'):
                    dc_id = cl.data_center.id
                    data_center = data_centers_map.get(dc_id, "N/A")

            # Uptime 계산
            uptime = "N/A"
            if hasattr(vm, 'start_time') and vm.start_time:
                current_time = datetime.now(timezone.utc)
                uptime_seconds = (current_time - vm.start_time).total_seconds()
                days = int(uptime_seconds // 86400)
                hours = int((uptime_seconds % 86400) // 3600)
                minutes = int((uptime_seconds % 3600) // 60)
                uptime = f"{days}d {hours}h {minutes}m"

            # 한 행(row) 생성
            row = [name, status, host_name, data_center, cluster_name, uptime]

            # 현재 행 출력
            row_y = 7 + idx
            row_text = "│" + "│".join(
                get_display_width(truncate_with_ellipsis(ensure_non_empty(row[i]), col_widths[i]), col_widths[i])
                for i in range(len(row))
            ) + "│"

            # 현재 선택된 VM은 강조 표시
            if focus == 0 and global_vm_index == vm_global_index:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(row_y, 1, row_text)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(row_y, 1, row_text)

        # 테이블 하단 테두리 출력
        bottom_border = "└" + "┴".join("─" * w for w in col_widths) + "┘"
        stdscr.addstr(7 + (end_idx - start_idx), 1, bottom_border)

        # ----- HOST Resource usage 테이블 -----
        if now - last_host_poll >= host_poll_interval:
            try:
                selected_vm = current_vms[vm_global_index] if total_vm_count > 0 else None
                selected_dc_id = get_dc_id_from_vm(selected_vm) if selected_vm else None
                all_hosts = hosts_service.list()
                if selected_dc_id is not None:
                    filtered_hosts = [host for host in all_hosts if get_dc_id_from_host(host) == selected_dc_id]
                else:
                    filtered_hosts = all_hosts
                cached_hosts = filtered_hosts
                usage = {}
                for host in cached_hosts:
                    try:
                        host_service = hosts_service.host_service(host.id)
                        statistics = host_service.statistics_service().list()
                        idle_val = 0.0
                        for hstat in statistics:
                            if hstat.name == "cpu.current.idle":
                                if hstat.values and hstat.values[0].datum is not None:
                                    idle_val = float(hstat.values[0].datum)
                                elif hstat.value is not None:
                                    idle_val = float(hstat.value)
                                break
                        if idle_val <= 1.0:
                            idle_val *= 100.0
                        cpu_usage = 100.0 - idle_val
                        if cpu_usage < 0:
                            cpu_usage = 0.0
                        memory_used = next((s.values[0].datum for s in statistics if 'memory.used' in s.name.lower()), 0)
                        memory_total = next((s.values[0].datum for s in statistics if 'memory.total' in s.name.lower()), 0)
                        memory_usage = (memory_used / memory_total) * 100 if memory_total > 0 else "N/A"
                        cluster_name = "N/A"
                        data_center_name = "N/A"
                        if host.cluster and host.cluster.id in clusters_map:
                            cl = clusters_map[host.cluster.id]
                            cluster_name = cl.name if getattr(cl, 'name', None) else "N/A"
                            if hasattr(cl, 'data_center') and cl.data_center and hasattr(cl.data_center, 'id'):
                                dc_id = cl.data_center.id
                                data_center_name = data_centers_map.get(dc_id, "N/A")
                        usage[host.name] = {
                            'cpu': int(round(cpu_usage)) if isinstance(cpu_usage, (float, int)) else "N/A",
                            'memory': int(round(memory_usage)) if isinstance(memory_usage, (float, int)) else "N/A",
                            'data_center': data_center_name,
                            'cluster': cluster_name
                        }
                    except Exception:
                        usage[host.name] = {'cpu': "N/A", 'memory': "N/A", 'data_center': "N/A", 'cluster': "N/A"}
                cached_usage = usage
            except Exception:
                cached_usage = {}
            last_host_poll = now

        total_host_count = len(cached_hosts) if 'cached_hosts' in locals() else 0
        current_host_page = host_global_index // host_rows_per_page if total_host_count > 0 else 0
        total_host_pages = (total_host_count + host_rows_per_page - 1) // host_rows_per_page if total_host_count > 0 else 1
        if host_global_index >= total_host_count:
            host_global_index = total_host_count - 1 if total_host_count > 0 else 0
        start_idx_hosts = current_host_page * host_rows_per_page
        end_idx_hosts = min(start_idx_hosts + host_rows_per_page, total_host_count)
        selected_vm = current_vms[vm_global_index] if total_vm_count > 0 else None
        host_title = f"- HOST Resource usage for {selected_vm.name} (Total {total_host_count} Host)" if selected_vm else "- HOST Resource usage"
        host_page_info = f"{current_host_page+1}/{total_host_pages}" if total_host_pages > 1 else ""
        base_line = 9 + (end_idx - start_idx)
        stdscr.addstr(base_line, 1, host_title.ljust(121 - len(host_page_info)) + host_page_info)
        host_col_widths = [26, 14, 14, 31, 30]
        host_headers = ["Host Name", "CPU Usage", "Memory Usage", "Data Center", "Cluster"]
        host_top_border = "┌" + "┬".join("─" * w for w in host_col_widths) + "┐"
        stdscr.addstr(base_line + 1, 1, host_top_border)
        host_header_row = "│" + "│".join(
            get_display_width(truncate_with_ellipsis(ensure_non_empty(col), w), w)
            for col, w in zip(host_headers, host_col_widths)
        ) + "│"
        stdscr.addstr(base_line + 2, 1, host_header_row)
        host_divider = "├" + "┼".join("─" * w for w in host_col_widths) + "┤"
        stdscr.addstr(base_line + 3, 1, host_divider)
        for idx, host in enumerate(cached_hosts[start_idx_hosts:end_idx_hosts]):
            global_host_index = start_idx_hosts + idx
            host_name = host.name
            cpu = str(cached_usage.get(host_name, {}).get('cpu', "N/A")) + '%'
            memory = str(cached_usage.get(host_name, {}).get('memory', "N/A")) + '%'
            dc_usage = cached_usage.get(host_name, {}).get('data_center', "N/A")
            cl_usage = cached_usage.get(host_name, {}).get('cluster', "N/A")
            row_str = "│" + "│".join([
                get_display_width(truncate_with_ellipsis(ensure_non_empty(host_name), host_col_widths[0]), host_col_widths[0]),
                get_display_width(truncate_with_ellipsis(ensure_non_empty(cpu), host_col_widths[1]), host_col_widths[1]),
                get_display_width(truncate_with_ellipsis(ensure_non_empty(memory), host_col_widths[2]), host_col_widths[2]),
                get_display_width(truncate_with_ellipsis(ensure_non_empty(dc_usage), host_col_widths[3]), host_col_widths[3]),
                get_display_width(truncate_with_ellipsis(ensure_non_empty(cl_usage), host_col_widths[4]), host_col_widths[4])
            ]) + "│"
            if focus == 1 and global_host_index == host_global_index:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(base_line + 4 + idx, 1, row_str)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(base_line + 4 + idx, 1, row_str)
        host_bottom_border = "└" + "┴".join("─" * w for w in host_col_widths) + "┘"
        stdscr.addstr(base_line + 4 + (end_idx_hosts - start_idx_hosts), 1, host_bottom_border)

        # ── 하단 내비게이션 ──
        left_nav = "TAB=Switch Focus | ▲/▼=Navigate | ENTER=View Events or Details | ESC=Go back | Q=Quit"
        right_nav = "N=Next | P=Prev" if total_pages > 1 or total_host_pages > 1 else ""
        stdscr.addstr(height - 1, 1, left_nav.ljust(121 - len(right_nav)) + right_nav, curses.A_NORMAL)
        stdscr.addstr(height - 2, 1,
            "S=Start | D=Normal Down | F=Force Down | R=Restart | M=Migrate | U=Suspend | SPACE=Select",
            curses.A_NORMAL)
        stdscr.refresh()

        key = stdscr.getch()
        if key == curses.KEY_UP:
            if focus == 0:
                vm_global_index = (vm_global_index - 1) % total_vm_count if total_vm_count > 0 else 0
            elif focus == 1:
                host_global_index = (host_global_index - 1) % total_host_count if total_host_count > 0 else 0
        elif key == curses.KEY_DOWN:
            if focus == 0:
                vm_global_index = (vm_global_index + 1) % total_vm_count if total_vm_count > 0 else 0
            elif focus == 1:
                host_global_index = (host_global_index + 1) % total_host_count if total_host_count > 0 else 0
        elif key == 9:  # TAB 키: 포커스 전환
            focus = (focus + 1) % 2
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key == 27:
            break
        else:
            if focus == 0:
                if key in (ord('n'), ord('N')):
                    current_vm_page = vm_global_index // rows_per_page
                    if current_vm_page < total_pages - 1:
                        vm_global_index = (current_vm_page + 1) * rows_per_page
                    else:
                        vm_global_index = 0
                elif key in (ord('p'), ord('P')):
                    current_vm_page = vm_global_index // rows_per_page
                    if current_vm_page > 0:
                        vm_global_index = (current_vm_page - 1) * rows_per_page
                    else:
                        vm_global_index = (total_pages - 1) * rows_per_page
                elif key == ord(' '):
                    if vm_global_index in selected_vms:
                        selected_vms.remove(vm_global_index)
                    else:
                        selected_vms.add(vm_global_index)
                elif key in (ord('s'), ord('S')):
                    if selected_vms:
                        for idx in selected_vms:
                            vm = current_vms[idx]
                            vm_status = vm.status.value.lower() if vm.status else "n/a"
                            if vm_status == "up":
                                continue
                            elif vm_status == "suspended":
                                try:
                                    vm_service = vms_service.vm_service(vm.id)
                                    vm_service.start()
                                    time.sleep(1)
                                except Exception:
                                    try:
                                        vm_service.wake_up()
                                    except Exception:
                                        pass
                            else:
                                manage_vms([vm], "start", vms_service, stdscr)
                            with vm_lock:
                                pending_start_vms.add(idx)
                        selected_vms.clear()
                elif key in (ord('d'), ord('D')):
                    if selected_vms:
                        for idx in selected_vms:
                            vm = current_vms[idx]
                            vm_status = vm.status.value.lower() if vm.status else "n/a"
                            if vm_status not in ["up", "powering_up", "suspended"]:
                                continue
                            confirm = confirm_shutdown_popup(stdscr, vm.name)
                            if confirm:
                                vm_service = vms_service.vm_service(vm.id)
                                try:
                                    if vm_status == "suspended":
                                        try:
                                            vm_service.shutdown()
                                            time.sleep(1)
                                        except Exception:
                                            pass
                                        try:
                                            vm_service.stop()
                                        except Exception as e:
                                            show_error_popup(stdscr, "Stop Failed", f"Failed to stop VM '{vm.name}': {str(e)}")
                                    else:
                                        manage_vms([vm], "stop", vms_service, stdscr)
                                except Exception as e:
                                    show_error_popup(stdscr, "Stop Failed", f"Failed to stop VM '{vm.name}': {str(e)}")
                                try:
                                    vms = vms_service.list()
                                except Exception:
                                    pass
                        selected_vms.clear()
                elif key in (ord('f'), ord('F')):
                    if selected_vms:
                        for idx in selected_vms:
                            vm = current_vms[idx]
                            vm_status = vm.status.value.lower() if vm.status else "n/a"
                            if vm_status in ["up", "powering_up", "suspended"]:
                                confirm = confirm_shutdown_popup(stdscr, vm.name)
                                if confirm:
                                    try:
                                        vm_service = vms_service.vm_service(vm.id)
                                        vm_service.stop(force=True)
                                    except Exception as e:
                                        show_error_popup(stdscr, "Force Down Failed", f"Failed to force down VM '{vm.name}': {str(e)}")
                        selected_vms.clear()
                elif key in (ord('r'), ord('R')):
                    if selected_vms:
                        for idx in selected_vms:
                            vm = current_vms[idx]
                            manage_vms([vm], "restart", vms_service, stdscr)
                        try:
                            vms = vms_service.list()
                        except Exception:
                            pass
                        selected_vms.clear()
                elif key in (ord('m'), ord('M')):
                    if selected_vms:
                        for idx in selected_vms:
                            vm = current_vms[idx]
                            migrate_vm_popup(vm, hosts, connection.system_service().clusters_service(), stdscr, vms_service)
                        try:
                            vms = vms_service.list()
                        except Exception:
                            pass
                        selected_vms.clear()
                elif key in (ord('u'), ord('U')):
                    if selected_vms:
                        for idx in selected_vms:
                            vm = current_vms[idx]
                            if vm.status and vm.status.value.lower() == "up":
                                confirm = confirm_suspend_popup(stdscr, vm.name)
                                if confirm:
                                    try:
                                        vm_service = vms_service.vm_service(vm.id)
                                        vm_service.suspend()
                                    except Exception as e:
                                        show_error_popup(stdscr, "Suspend Failed", f"Failed to suspend VM '{vm.name}': {str(e)}")
                        selected_vms.clear()
                elif key == 10:
                    if vm_global_index < len(current_vms):
                        vm = current_vms[vm_global_index]
                    show_vm_details(stdscr, connection, vm)
                    selected_vms.clear()
            elif focus == 1:
                if key == 10:  # ENTER 키: 호스트 상세보기 화면 호출
                    if cached_hosts:
                        selected_host = cached_hosts[host_global_index]
                        show_host_detail_view(stdscr, connection, selected_host)
                elif key in (ord('n'), ord('N')):
                    current_host_page = host_global_index // host_rows_per_page
                    if current_host_page < total_host_pages - 1:
                        host_global_index = (current_host_page + 1) * host_rows_per_page
                    else:
                        host_global_index = 0
                elif key in (ord('p'), ord('P')):
                    current_host_page = host_global_index // host_rows_per_page
                    if current_host_page > 0:
                        host_global_index = (current_host_page - 1) * host_rows_per_page
                    else:
                        host_global_index = (total_host_pages - 1) * host_rows_per_page
    # end while

def manage_vms(selected_vms, action, vms_service, stdscr):
    for vm in selected_vms:
        vm_service = vms_service.vm_service(vm.id)
        try:
            if action == "start":
                if vm.status.value != "down":
                    continue
                vm_service.start()
            elif action == "stop":
                if vm.status.value not in ["up", "powering up"]:
                    continue
                vm_service.stop()
            elif action == "restart":
                if vm.status.value != "up":
                    continue
                vm_service.reboot()
        except Exception as e:
            error_message = f"Failed to {action} VM '{vm.name}':\n{str(e)}"
            show_error_popup(stdscr, f"Failed to {action} VM", error_message)
        stdscr.refresh()

def migrate_vm_popup(vm, hosts, clusters_service, stdscr, vms_service):
    height, width = stdscr.getmaxyx()
    MIN_HEIGHT, MIN_WIDTH = 15, 70
    if height < MIN_HEIGHT or width < MIN_WIDTH:
        stdscr.clear()
        stdscr.addstr(0, 0, f"Terminal too small ({width}x{height}). Resize and retry.")
        stdscr.refresh()
        stdscr.getch()
        return
    popup_height = min(12, height - 2)
    popup_width = min(60, width - 4)
    popup_y = max(0, (height - popup_height) // 2)
    popup_x = max(0, (width - popup_width) // 2)
    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)

    def safe_addstr(window, y, x, text, color=None):
        if 0 <= y < popup_height and 0 <= x < popup_width - 1:
            text = text[:popup_width - x - 1]
            try:
                if color:
                    window.attron(color)
                    window.addstr(y, x, text)
                    window.attroff(color)
                else:
                    window.addstr(y, x, text)
            except curses.error:
                pass
    try:
        while True:
            popup.clear()
            popup.border()
            title = f"Select target host for VM '{vm.name}':"
            safe_addstr(popup, 1, 2, title)
            if vm.status.value == "down":
                safe_addstr(popup, 3, 2, "VM is in 'Down' state.")
                footer_msg = "Press any key to close"
                x_pos = (popup_width - len(footer_msg)) // 2
                safe_addstr(popup, popup_height - 2, x_pos, footer_msg)
                popup.refresh()
                popup.getch()
                return
            cluster_id = vm.cluster.id if vm.cluster else None
            if not cluster_id:
                safe_addstr(popup, 3, 2, "No valid cluster found.")
                footer_msg = "Press any key to close"
                x_pos = (popup_width - len(footer_msg)) // 2
                safe_addstr(popup, popup_height - 2, x_pos, footer_msg)
                popup.refresh()
                popup.getch()
                return
            target_hosts = [host for host in hosts if host.cluster.id == cluster_id and host.id != (vm.host.id if vm.host else None)]
            if not target_hosts:
                safe_addstr(popup, 3, 2, "No available hosts in cluster.")
                footer_msg = "Press any key to close"
                x_pos = (popup_width - len(footer_msg)) // 2
                safe_addstr(popup, popup_height - 2, x_pos, footer_msg)
                popup.refresh()
                popup.getch()
                return
            current_row = 0
            max_host_display = popup_height - 5
            for idx, host in enumerate(target_hosts[:max_host_display]):
                row_y = 3 + idx
                host_name = host.name[:popup_width - 4]
                if idx == current_row:
                    safe_addstr(popup, row_y, 2, host_name, curses.color_pair(1))
                else:
                    safe_addstr(popup, row_y, 2, host_name)
            footer = "▲/▼: Navigate | ENTER: Select | ESC: Cancel"
            # (네비게이션 문구는 그대로 좌측 정렬)
            safe_addstr(popup, popup_height - 2, 2, footer)
            popup.refresh()
            key = popup.getch()
            if key == curses.KEY_UP and current_row > 0:
                current_row -= 1
            elif key == curses.KEY_DOWN and current_row < len(target_hosts) - 1:
                current_row += 1
            elif key == 27:
                return
            elif key == 10:
                target_host = target_hosts[current_row]
                try:
                    vm_service = vms_service.vm_service(vm.id)
                    vm_service.migrate(host=target_host)
                    popup.clear()
                    popup.border()
                    safe_addstr(popup, 3, 2, f"VM '{vm.name}' migrated to '{target_host.name}'.")
                    footer_msg = "Press any key to close"
                    x_pos = (popup_width - len(footer_msg)) // 2
                    safe_addstr(popup, popup_height - 2, x_pos, footer_msg)
                    popup.refresh()
                    popup.getch()
                    return
                except Exception as e:
                    popup.clear()
                    popup.border()
                    safe_addstr(popup, 3, 2, f"Migration failed: {str(e)}")
                    footer_msg = "Press any key to close"
                    x_pos = (popup_width - len(footer_msg)) // 2
                    safe_addstr(popup, popup_height - 2, x_pos, footer_msg)
                    popup.refresh()
                    popup.getch()
                    return
    except curses.error as e:
        stdscr.clear()
        stdscr.addstr(0, 0, f"Error rendering popup. Terminal: {width}x{height}")
        stdscr.addstr(1, 0, f"Exception: {str(e)}")
        stdscr.refresh()
        stdscr.getch()

def confirm_shutdown_popup(stdscr, vm_name):
    height, width = stdscr.getmaxyx()
    popup_height = min(12, height - 2)
    popup_width = min(60, width - 4)
    popup_y = max(0, (height - popup_height) // 2)
    popup_x = max(0, (width - popup_width) // 2)
    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)
    options = ["Yes", "No"]
    current_option = 0
    while True:
        popup.erase()
        popup.border()
        title = "Are you sure you want to shutdown?"
        vm_text = f"{vm_name}"
        popup.addstr(2, (popup_width - len(title)) // 2, title, curses.A_BOLD)
        popup.addstr(5, (popup_width - len(vm_text)) // 2, vm_text)
        yes_x = (popup_width // 2) - 8
        no_x = (popup_width // 2) + 4
        button_y = 8
        popup.addstr(button_y, yes_x - 1, "[ Yes ]" if current_option == 0 else "  Yes  ",
                     curses.A_BOLD if current_option == 0 else curses.A_NORMAL)
        popup.addstr(button_y, no_x - 1, "[ No ]" if current_option == 1 else "  No  ",
                     curses.A_BOLD if current_option == 1 else curses.A_NORMAL)
        instructions = "◀/▶: Move | ENTER: Select"
        popup.addstr(popup_height - 2, (popup_width - len(instructions)) // 2, instructions, curses.A_DIM)
        popup.refresh()
        key = popup.getch()
        if key in [curses.KEY_LEFT, curses.KEY_RIGHT]:
            current_option = 1 - current_option
        elif key == 10:
            return options[current_option] == "Yes"
        elif key == 27:
            return False
            
def show_host_detail_view(stdscr, connection, host):
    stdscr.clear()
    height, width = stdscr.getmaxyx()
    min_width, min_height = 121, 40
    if width < min_width or height < min_height:
        stdscr.addstr(0, 0, f"Terminal too small. Resize to at least {min_width}x{min_height}.")
        stdscr.refresh()
        stdscr.getch()
        return

    # ── [1] 상단: Hosts 상세 정보 테이블 ──
    col_headers = ["Engine", "Name", "Cluster", "Status", "VMs", "Memory Usage", "CPU Usage", "IP"]
    col_widths = [7, 20, 20, 19, 6, 12, 13, 15]
    top_border = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
    header_line = "│" + "│".join(f"{h:<{w}}" for h, w in zip(col_headers, col_widths)) + "│"
    divider_line = "├" + "┼".join("─" * w for w in col_widths) + "┤"
    bottom_border = "└" + "┴".join("─" * w for w in col_widths) + "┘"
    
    # HostedEngine 정보 조회
    try:
        vms_service = connection.system_service().vms_service()
        all_vms = vms_service.list()
        hosted_engine_vm = next((vm for vm in all_vms if vm.name == "HostedEngine"), None)
        if hosted_engine_vm:
            hosted_engine_host_id = hosted_engine_vm.host.id if hosted_engine_vm.host else None
            hosted_engine_cluster_id = hosted_engine_vm.cluster.id if hosted_engine_vm.cluster else None
        else:
            hosted_engine_host_id = hosted_engine_cluster_id = None
    except Exception:
        hosted_engine_host_id = hosted_engine_cluster_id = None

    engine = get_engine_status_symbol(host, hosted_engine_host_id, hosted_engine_cluster_id)
    try:
        if host.cluster:
            cluster_obj = connection.follow_link(host.cluster)
            cluster_name = cluster_obj.name if cluster_obj and getattr(cluster_obj, "name", None) else "-"
        else:
            cluster_name = "-"
    except Exception:
        cluster_name = "-"

    try:
        vms = connection.system_service().vms_service().list()
        vm_count = sum(1 for vm in vms if vm.host and vm.host.id == host.id)
    except Exception:
        vm_count = "-"

    # host의 statistics 조회
    try:
        hosts_service = connection.system_service().hosts_service()
        stat_list = hosts_service.host_service(host.id).statistics_service().list()
    except Exception:
        stat_list = []
    boot_time = None
    for stat in stat_list:
        if stat.name.lower() == "boot.time":
            try:
                boot_time_unix = int(stat.values[0].datum)
                boot_time = datetime.fromtimestamp(boot_time_unix, timezone.utc)
            except Exception:
                boot_time = None

    # CPU 및 Memory 사용률 계산 (Hosts 테이블에 퍼센트로 사용)
    cpu_usage_val = None
    for stat in stat_list:
        if 'cpu.current.idle' in stat.name.lower():
            try:
                idle_val = float(stat.values[0].datum)
                if idle_val <= 1.0:
                    idle_val *= 100.0
                cpu_usage_val = 100.0 - idle_val
            except Exception:
                cpu_usage_val = None
            break
    cpu_usage_str = f"{round(cpu_usage_val, 1)}%" if cpu_usage_val is not None else "N/A"

    mem_used = None
    mem_total = None
    for stat in stat_list:
        lname = stat.name.lower()
        if 'memory.used' in lname and stat.values and stat.values[0].datum is not None:
            try:
                mem_used = float(stat.values[0].datum)
            except Exception:
                mem_used = None
        if 'memory.total' in lname and stat.values and stat.values[0].datum is not None:
            try:
                mem_total = float(stat.values[0].datum)
            except Exception:
                mem_total = None
    if mem_used is not None and mem_total and mem_total > 0:
        # Hosts 테이블에는 퍼센트로 표시
        mem_usage_str = f"{round((mem_used/mem_total)*100, 1)}%"
    else:
        mem_usage_str = "N/A"

    ip_addr = host.address if hasattr(host, "address") and host.address else "-"
    if not ip_addr or not ip_addr.replace(".", "").isdigit():
        try:
            nics_temp = hosts_service.host_service(host.id).nics_service().list()
            for nic in nics_temp:
                if hasattr(nic, "ip") and nic.ip and hasattr(nic.ip, "address"):
                    ip_addr = nic.ip.address
                    break
        except Exception:
            pass

    header_str = "- Host for " + host.name
    stdscr.addstr(1, 1, header_str)
    y = 2
    stdscr.addstr(y, 1, top_border)
    stdscr.addstr(y+1, 1, header_line)
    stdscr.addstr(y+2, 1, divider_line)
    # Hosts 테이블 행 생성: Engine 열(첫 번째 열)은 중앙 정렬, 나머지는 좌측 정렬
    host_row = [
        engine,
        host.name if host.name else "-",
        cluster_name,
        host.status.value if hasattr(host, "status") and host.status else "-",
        str(vm_count),
        mem_usage_str,
        cpu_usage_str,
        ip_addr
    ]
    row_line = "│" + "│".join(
        f"{truncate_with_ellipsis(val, w):^{w}}" if i == 0 else f"{truncate_with_ellipsis(val, w):<{w}}"
        for i, (val, w) in enumerate(zip(host_row, col_widths))
    ) + "│"
    stdscr.addstr(y+3, 1, row_line)
    stdscr.addstr(y+4, 1, bottom_border)
    
    # ── [2] 상세 정보 영역 ──
    detail_y = y + 5
    if boot_time:
        now = datetime.now(timezone.utc)
        delta = now - boot_time
        uptime_str = f"{delta.days}d {delta.seconds//3600}h {(delta.seconds//60)%60}m"
    else:
        uptime_str = "N/A"

    # Memory 상세 정보: 절대치(GB 단위)
    if mem_used is not None and mem_total is not None and mem_total > 0:
        mem_detail_str = f"{mem_used/(1024**3):.2f}GB/{mem_total/(1024**3):.2f}GB"
    else:
        mem_detail_str = "N/A"

    # CPU 상세 정보: 할당된 VM 코어 / 호스트 총 코어 계산
    try:
        host_vms = [vm for vm in vms if vm.host and vm.host.id == host.id]
        assigned_vm_cpu = 0
        for vm in host_vms:
            if hasattr(vm, "cpu") and vm.cpu and hasattr(vm.cpu, "topology") and vm.cpu.topology:
                assigned_vm_cpu += vm.cpu.topology.sockets * vm.cpu.topology.cores
    except Exception:
        assigned_vm_cpu = None

    try:
        if hasattr(host, "cpu") and host.cpu and hasattr(host.cpu, "topology") and host.cpu.topology:
            topo = host.cpu.topology
            # 하이퍼스레딩까지 포함: threads 속성이 있으면 그 값, 없으면 1로 간주
            threads = topo.threads if getattr(topo, "threads", None) else 1
            host_total_cpu = topo.sockets * topo.cores * threads
        else:
            host_total_cpu = None
    except Exception:
        host_total_cpu = None

    if host_total_cpu is not None and assigned_vm_cpu is not None:
        cpu_detail_str = f"{assigned_vm_cpu}/{host_total_cpu}"
    else:
        cpu_detail_str = "N/A"

    stdscr.addstr(detail_y, 1, f"Uptime: {uptime_str}")
    stdscr.addstr(detail_y+1, 1, f"Memory Usage: {mem_detail_str}")
    stdscr.addstr(detail_y+2, 1, f"CPU Usage: {cpu_detail_str}")
    
    # ── [3] Network Interfaces 테이블 ──
    try:
        nics_raw = hosts_service.host_service(host.id).nics_service().list()
    except Exception:
        nics_raw = []
    nic_list = []
    for nic in nics_raw:
        device = nic.name if hasattr(nic, "name") and nic.name else "-"
        network_name = "-"
        if hasattr(nic, "network") and nic.network:
            try:
                net_obj = connection.follow_link(nic.network)
                network_name = net_obj.name if net_obj and getattr(net_obj, "name", None) else "-"
            except Exception:
                network_name = "-"
        elif hasattr(nic, "vnic_profile") and nic.vnic_profile:
            try:
                vp_obj = connection.follow_link(nic.vnic_profile)
                network_name = vp_obj.name if vp_obj and getattr(vp_obj, "name", None) else "-"
            except Exception:
                network_name = "-"
        ip_addr_nic = nic.ip.address if hasattr(nic, "ip") and nic.ip and hasattr(nic.ip, "address") else "-"
        mac_addr = nic.mac.address if hasattr(nic, "mac") and nic.mac and hasattr(nic.mac, "address") else "-"
        speed = get_network_speed(device)
        vlan = nic.vlan.id if hasattr(nic, "vlan") and nic.vlan and hasattr(nic.vlan, "id") else "-"
        nic_list.append([device, network_name, ip_addr_nic, mac_addr, speed, vlan])
    net_y = detail_y + 4
    total_line_length = 121
    nic_title = "- Network Interfaces for " + host.name
    net_headers = ["Devices", "Network Name", "IP", "Mac Address", "Speed", "VLAN"]
    net_col_widths = [20, 20, 16, 26, 18, 14]
    net_top = "┌" + "┬".join("─" * w for w in net_col_widths) + "┐"
    net_header_line = "│" + "│".join(f"{h:<{w}}" for h, w in zip(net_headers, net_col_widths)) + "│"
    net_divider = "├" + "┼".join("─" * w for w in net_col_widths) + "┤"
    net_bottom = "└" + "┴".join("─" * w for w in net_col_widths) + "┘"
    
    # ── [4] Events 테이블 ──
    try:
        events_service = connection.system_service().events_service()
        events = events_service.list(search=f"host.name={host.name}", max=50)
    except Exception as e:
        events = []
        events.append(type("DummyEvent", (), {"time": None,
                                                "severity": type("DummySeverity", (), {"name": "-"})(),
                                                "description": f"Error: {str(e)}"}))
    event_col_widths = [19, 9, 89]
    event_top = "┌" + "┬".join("─" * w for w in event_col_widths) + "┐"
    event_header_line = "│" + "│".join(f"{h:<{w}}" for h, w in zip(["Time", "Severity", "Description"], event_col_widths)) + "│"
    event_divider = "├" + "┼".join("─" * w for w in event_col_widths) + "┤"
    event_bottom = "└" + "┴".join("─" * w for w in event_col_widths) + "┘"
    
    # ── [5] 인터랙티브 루프 ──
    # NIC 테이블 페이징 변수
    nic_page_size = 4
    total_nic_pages = max(1, (len(nic_list) + nic_page_size - 1) // nic_page_size)
    current_nic_page = 0

    # 포커스 활성화 조건:
    # NIC 테이블은 페이지가 두 페이지 이상일 때만 포커스 가능
    # Events 테이블은 제목 열을 제외한 데이터 행이 1개 이상일 때만 포커스 가능
    nic_focusable = (total_nic_pages >= 2)
    events_focusable = (len(events) >= 1)

    # 초기 포커스: NIC 테이블이 포커스 가능하면 0, 아니면 1
    focus_area = 0 if nic_focusable else 1  
    selected_nic_index = 0
    selected_event_index = 0

    while True:
        stdscr.erase()
        # 상단 고정 영역 출력
        stdscr.addstr(1, 1, header_str)
        stdscr.addstr(y, 1, top_border)
        stdscr.addstr(y+1, 1, header_line)
        stdscr.addstr(y+2, 1, divider_line)
        stdscr.addstr(y+3, 1, row_line)
        stdscr.addstr(y+4, 1, bottom_border)
        stdscr.addstr(detail_y, 1, f"Uptime: {uptime_str}")
        stdscr.addstr(detail_y+1, 1, f"Memory Usage: {mem_detail_str}")
        stdscr.addstr(detail_y+2, 1, f"CPU Usage: {cpu_detail_str}")
        
        # ── NIC 테이블 그리기 ──
        if total_nic_pages > 1:
            nic_header = nic_title.ljust(total_line_length - len(f"{current_nic_page+1}/{total_nic_pages}")) + f"{current_nic_page+1}/{total_nic_pages}"
        else:
            nic_header = nic_title
        stdscr.addstr(net_y, 1, nic_header)
        stdscr.addstr(net_y+1, 1, net_top)
        stdscr.addstr(net_y+2, 1, net_header_line)
        stdscr.addstr(net_y+3, 1, net_divider)
        current_y = net_y + 4
        start_idx_nic = current_nic_page * nic_page_size
        end_idx_nic = min(start_idx_nic + nic_page_size, len(nic_list))
        for idx, row in enumerate(nic_list[start_idx_nic:end_idx_nic]):
            full_text = "│" + "│".join(f"{truncate_with_ellipsis(val, w):<{w}}" for val, w in zip(row, net_col_widths)) + "│"
            if focus_area == 0 and (start_idx_nic + idx) == selected_nic_index:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(current_y, 1, full_text)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(current_y, 1, full_text)
            current_y += 1
        stdscr.addstr(current_y, 1, net_bottom)
        
        # ── Events 테이블 그리기 ──
        events_y = current_y + 2
        event_page_size = max(1, 42 - (events_y + 4))
        total_event_pages = max(1, (len(events) + event_page_size - 1) // event_page_size)
        if total_event_pages > 1:
            events_header = ("- Events for " + host.name).ljust(121 - len(f"{(selected_event_index//event_page_size)+1}/{total_event_pages}")) + f"{(selected_event_index//event_page_size)+1}/{total_event_pages}"
        else:
            events_header = "- Events for " + host.name
        stdscr.addstr(events_y, 1, events_header)
        stdscr.addstr(events_y+1, 1, event_top)
        stdscr.addstr(events_y+2, 1, event_header_line)
        stdscr.addstr(events_y+3, 1, event_divider)
        start_idx_event = (selected_event_index // event_page_size) * event_page_size
        end_idx_event = min(start_idx_event + event_page_size, len(events))
        data_y = events_y + 4
        for idx, evt in enumerate(events[start_idx_event:end_idx_event]):
            time_str = evt.time.strftime("%Y-%m-%d %H:%M:%S") if evt.time else "-"
            severity = evt.severity.name if hasattr(evt.severity, "name") else "-"
            description = evt.description if evt.description else "-"
            row_text = "│" + "│".join([
                f"{truncate_with_ellipsis(time_str, event_col_widths[0]):<{event_col_widths[0]}}",
                f"{truncate_with_ellipsis(severity, event_col_widths[1]):<{event_col_widths[1]}}",
                f"{truncate_with_ellipsis(description, event_col_widths[2]):<{event_col_widths[2]}}"
            ]) + "│"
            if focus_area == 1 and (start_idx_event + idx) == selected_event_index:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(data_y, 1, row_text)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(data_y, 1, row_text)
            data_y += 1
        stdscr.addstr(data_y, 1, event_bottom)
        
        # 네비게이션 줄: 왼쪽 안내 + 오른쪽 "N=Next | P=Prev" (포커스 가능한 테이블 중 페이지 수가 2페이지 이상이면)
        nav_left = "TAB=Switch Focus | ▲/▼=Navigate | ENTER=View Details | ESC=Go back | Q=Quit"
        if (total_nic_pages > 1) or (total_event_pages > 1):
            right_nav = "N=Next | P=Prev"
        else:
            right_nav = ""
        nav_line = nav_left.ljust(121 - len(right_nav)) + right_nav
        stdscr.addstr(height - 1, 1, nav_line, curses.A_DIM)
        stdscr.refresh()

        key = stdscr.getch()
        if key == 9:  # TAB 키
            if nic_focusable and events_focusable:
                focus_area = 1 - focus_area
            elif events_focusable:
                focus_area = 1
            elif nic_focusable:
                focus_area = 0
        elif key == curses.KEY_UP:
            if focus_area == 0 and nic_list:
                selected_nic_index = (selected_nic_index - 1) % len(nic_list)
                current_nic_page = selected_nic_index // nic_page_size
            elif focus_area == 1 and events:
                selected_event_index = (selected_event_index - 1) % len(events)
        elif key == curses.KEY_DOWN:
            if focus_area == 0 and nic_list:
                selected_nic_index = (selected_nic_index + 1) % len(nic_list)
                current_nic_page = selected_nic_index // nic_page_size
            elif focus_area == 1 and events:
                selected_event_index = (selected_event_index + 1) % len(events)
        elif key in (ord('n'), ord('N')):
            if focus_area == 0 and total_nic_pages > 1:
                if current_nic_page < total_nic_pages - 1:
                    current_nic_page += 1
                    selected_nic_index = current_nic_page * nic_page_size
            elif focus_area == 1 and total_event_pages > 1:
                if (selected_event_index // event_page_size) < (total_event_pages - 1):
                    selected_event_index = ((selected_event_index // event_page_size) + 1) * event_page_size
        elif key in (ord('p'), ord('P')):
            if focus_area == 0 and total_nic_pages > 1:
                if current_nic_page > 0:
                    current_nic_page -= 1
                    selected_nic_index = current_nic_page * nic_page_size
            elif focus_area == 1 and total_event_pages > 1:
                if (selected_event_index // event_page_size) > 0:
                    selected_event_index = ((selected_event_index // event_page_size) - 1) * event_page_size
        elif key == 10:  # ENTER 키
            if focus_area == 1 and events:
                selected_evt = events[selected_event_index]
                popup_height = min(height - 4, 20)
                popup_width = min(width - 4, 100)
                popup_y = (height - popup_height) // 2
                popup_x = (width - popup_width) // 2
                popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
                popup.keypad(True)
                popup.border()
                tstr = selected_evt.time.strftime("%Y-%m-%d %H:%M:%S") if selected_evt.time else "-"
                sev = selected_evt.severity.name if hasattr(selected_evt.severity, "name") else "-"
                desc = selected_evt.description if selected_evt.description else "-"
                popup.addstr(1, 2, f"Time: {tstr}")
                popup.addstr(2, 2, f"Severity: {sev}")
                wrapped = textwrap.wrap(desc, popup_width - 4)
                for i, line in enumerate(wrapped):
                    if i + 3 < popup_height - 2:
                        popup.addstr(i + 3, 2, line)
                msg = "Press any key to close"
                x_pos = (popup_width - len(msg)) // 2
                popup.addstr(popup_height - 2, x_pos, msg, curses.A_DIM)
                popup.refresh()
                popup.getch()
                popup.clear()
                popup.refresh()
            # NIC 테이블에서는 ENTER 키 동작 없음.
        elif key in (27,):
            break
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
    stdscr.clear()
    stdscr.refresh()

def show_vm_details(stdscr, connection, vm):
    """
    선택한 VM의 상세 정보를 인터랙티브하게 표시함
    상단은 VM Details 테이블(단일행, 기존 행 수 유지)이며,
    그 아래 Network Details, Disk Details, Events 테이블을 각각
      - Network Details: 페이지가 2페이지 이상일 때만 포커스 기능이 적용 (그 외에는 단순 출력)
      - Disk Details: ENTER 키를 누르면 디스크 상세 팝업이 뜨므로 항상 포커스 기능 적용
      - Events: ENTER 키를 누르면 이벤트 상세 팝업이 뜨므로 항상 포커스 기능 적용
    TAB, 방향키, N/P 키로 포커스 전환/페이지 이동하며, ESC 키를 누르면 이전 화면으로 돌아감
    """
    curses.curs_set(0)
    # ESC 키 반응속도 개선 (Python3.7 이상에서만 지원)
    if hasattr(curses, 'set_escdelay'):
        curses.set_escdelay(25)
    stdscr.timeout(50)
    # 초기 focus: 0 = Network Details, 1 = Disk Details, 2 = Events
    focus = 0

    # 각 테이블의 전체 목록 내 커서 인덱스
    net_index = 0    # Network Details 전체 목록 인덱스
    disk_index = 0   # Disk Details 전체 목록 인덱스
    event_index = 0  # Events 전체 목록 인덱스

    # 각 테이블의 페이지당 행 수
    net_rows_per_page = 4
    disk_rows_per_page = 4

    # ----- [Disk Details 데이터 준비] -----
    disk_header = ["Alias", "OS", "Size (GB)", "Attached To", "Interface",
                   "Logical Name", "Status", "Type", "Policy", "Storage Domain"]
    disk_widths = [19, 5, 11, 14, 12, 12, 6, 7, 9, 15]
    disk_data = []
    disk_objects = []  # 각 디스크의 상세 정보를 딕셔너리로 저장 (팝업용)
    try:
        vm_service = connection.system_service().vms_service().vm_service(vm.id)
        disk_attachments_service = vm_service.disk_attachments_service()
        attachments = disk_attachments_service.list()
        boot_disk_id = None
        for att in attachments:
            if att.bootable:
                boot_disk_id = att.disk.id
                break
        if not attachments:
            disk_data.append(["-"] * len(disk_header))
            disk_objects.append(None)
        else:
            for att in attachments:
                try:
                    logical_name = att.logical_name if att.logical_name else "-"
                    disk = connection.follow_link(att.disk)
                    os_field = "Yes" if disk.id == boot_disk_id else "No"
                    storage_domain = "-"
                    if disk.storage_domains:
                        storage_domains = [connection.follow_link(sd).name for sd in disk.storage_domains]
                        storage_domain = ", ".join(storage_domains) if any(storage_domains) else "-"
                    row = [
                        truncate_with_ellipsis(disk.alias or '-', disk_widths[0]),
                        truncate_with_ellipsis(os_field, disk_widths[1]),
                        truncate_with_ellipsis(f"{disk.provisioned_size / (1024**3):.2f}" if disk.provisioned_size else '-', disk_widths[2]),
                        truncate_with_ellipsis(vm.name or '-', disk_widths[3]),
                        truncate_with_ellipsis(att.interface or '-', disk_widths[4]),
                        truncate_with_ellipsis(logical_name, disk_widths[5]),
                        truncate_with_ellipsis(str(disk.status) if disk.status else '-', disk_widths[6]),
                        truncate_with_ellipsis(getattr(disk, 'storage_type', '-') or '-', disk_widths[7]),
                        truncate_with_ellipsis("Thin" if disk.sparse else "Preallocated", disk_widths[8]),
                        truncate_with_ellipsis(storage_domain, disk_widths[9])
                    ]
                    disk_data.append(row)
                    disk_dict = {
                        'name': disk.name or "N/A",
                        'alias': disk.alias if hasattr(disk, 'alias') and disk.alias else "N/A",
                        'size': f"{disk.provisioned_size / (1024**3):.2f}" if disk.provisioned_size else "N/A",
                        'storage_domain': storage_domain,
                        'vm_name': vm.name or "N/A",
                        'content_type': os_field,
                        'id': disk.id,
                        'description': disk.description if hasattr(disk, 'description') and disk.description else "N/A",
                        'disk_profile': str(disk.disk_profile) if hasattr(disk, 'disk_profile') and disk.disk_profile else "N/A",
                        'wipe_after_delete': disk.wipe_after_delete if hasattr(disk, 'wipe_after_delete') else "N/A",
                        'virtual_size': f"{disk.provisioned_size / (1024**3):.2f}" if disk.provisioned_size else "N/A",
                        'actual_size': f"{disk.actual_size / (1024**3):.2f}" if hasattr(disk, 'actual_size') and disk.actual_size else "N/A",
                        'allocation_policy': "Thin" if disk.sparse else "Preallocated"
                    }
                    disk_objects.append(disk_dict)
                except Exception:
                    continue
    except Exception as e:
        disk_data.append(["Error:", truncate_with_ellipsis(str(e), 50)] + ["-"] * (len(disk_header) - 2))
        disk_objects.append(None)
    total_disks = len(disk_data)
    total_disk_pages = max(1, (total_disks + disk_rows_per_page - 1) // disk_rows_per_page)

    # ----- [Network Details 데이터 준비] -----
    nic_header = ["NIC Name", "Network Name", "IPv4", "MAC",
                  "Link State", "Interface", "Speed (Mbps)", "Port Mirroring"]
    nic_widths = [15, 15, 16, 18, 11, 10, 13, 14]
    nics_data = []
    try:
        vm_service = connection.system_service().vms_service().vm_service(vm.id)
        nics_service = vm_service.nics_service()
        nics = nics_service.list()
        mac_ip_mapping = {}
        if vm.status == types.VmStatus.UP:
            try:
                reported_devices = vm_service.reported_devices_service().list()
                for device in reported_devices:
                    if device.ips:
                        for ip in device.ips:
                            mac_ip_mapping[device.mac.address] = ip.address
            except Exception:
                pass
        for nic in nics:
            network_name = "-"
            try:
                if nic.vnic_profile and nic.vnic_profile.id:
                    vnic_profile_service = connection.system_service().vnic_profiles_service()
                    vnic_profile = vnic_profile_service.profile_service(nic.vnic_profile.id).get()
                    if vnic_profile.network:
                        networks_service = connection.system_service().networks_service()
                        network = networks_service.network_service(vnic_profile.network.id).get()
                        network_name = network.name if network.name else "-"
            except Exception:
                pass
            ipv4 = mac_ip_mapping.get(nic.mac.address, "-")
            nic_row = [
                nic.name or '-',
                network_name,
                ipv4,
                nic.mac.address if nic.mac else '-',
                'Yes' if nic.linked else 'No',
                nic.interface or '-',
                '-',
                'Disabled'
            ]
            nics_data.append(nic_row)
    except Exception as e:
        nics_data.append(["Error:", truncate_with_ellipsis(str(e), 50)] + ["-"] * (len(nic_header) - 2))
    if not nics_data:
        nics_data.append(["-"] * len(nic_header))
    net_total = len(nics_data)
    total_net_pages = max(1, (net_total + net_rows_per_page - 1) // net_rows_per_page)

    # ----- [Events 데이터 준비] -----
    event_header = ["Time", "Severity", "Description"]
    event_widths = [19, 9, 89]
    try:
        events_service = connection.system_service().events_service()
        events = events_service.list(search=f"vm.name={vm.name}", max=50)
    except Exception as e:
        events = []
        events.append(type("DummyEvent", (), {"time": None,
                                                "severity": type("DummySeverity", (), {"name": "-"})(),
                                                "description": f"Error: {str(e)}"}))
    # 기본 event_page_size는 디스크 테이블 아래 표시할 여유 공간에 따라 조정됨
    event_page_size = 8
    total_event_pages = math.ceil(len(events) / event_page_size) if len(events) > 0 else 1

    # ----- [VM Details 데이터 준비] -----
    vm_details_title = f"- VM Details for {vm.name}"
    vm_details_header = ["Status", "Uptime", "Operating System", "Chipset/F/W Type",
                           "Defined Memory", "Memory Guaranteed", "Guest CPU Count", "HA"]
    vm_details_widths = [7, 14, 20, 18, 14, 17, 15, 7]
    vm_status = vm.status if vm.status else "N/A"
    if vm.start_time and vm.status == types.VmStatus.UP:
        uptime_seconds = int(time.time() - vm.start_time.timestamp())
        days = uptime_seconds // 86400
        hours = (uptime_seconds % 86400) // 3600
        minutes = (uptime_seconds % 3600) // 60
        uptime_str = f"{days}D {hours}h {minutes}m"
    else:
        uptime_str = "N/A"
    os_type = vm.os.type if vm.os and vm.os.type else "N/A"
    chipset = vm.custom_emulated_machine if vm.custom_emulated_machine else (vm.bios.type if vm.bios and vm.bios.type else "N/A")
    defined_memory = f"{(vm.memory / (1024**3)):.2f} GB" if vm.memory else "N/A"
    memory_guaranteed = f"{(vm.memory_policy.guaranteed / (1024**3)):.2f} GB" if vm.memory_policy and vm.memory_policy.guaranteed else "N/A"
    if vm.cpu and vm.cpu.topology:
        guest_cpu_count = vm.cpu.topology.sockets * vm.cpu.topology.cores
    else:
        guest_cpu_count = "N/A"
    ha_status = "Yes" if vm.high_availability and vm.high_availability.enabled else "No"
    vm_details_row = [str(vm_status), uptime_str, os_type, chipset, defined_memory, memory_guaranteed, str(guest_cpu_count), ha_status]

    # --- 포커스 적용 여부 플래그 설정 ---
    # 네트워크 테이블은 페이지가 2페이지 이상일 때만 인터랙티브하게 동작 (ENTER키 동작 없음)
    net_focusable = (total_net_pages > 1)
    # 디스크 및 이벤트 테이블은 ENTER키 입력 시 팝업창이 뜨므로 항상 인터랙티브하게 동작
    disk_focusable = True
    events_focusable = True

    # 초기 focus 조정 (만약 기본 focus(네트워크)가 인터랙티브하지 않으면 다른 테이블로)
    if focus == 0 and not net_focusable:
        if disk_focusable:
            focus = 1
        elif events_focusable:
            focus = 2

    while True:
        stdscr.erase()
        height, width = stdscr.getmaxyx()
        if height < 45 or width < 122:
            stdscr.addstr(0, 0, "Terminal too small. Resize to at least 122x45.")
            stdscr.refresh()
            stdscr.getch()
            continue

        cur_y = 1
        # --- [1] VM Details 테이블 출력 (단순 출력, 포커스 없음) ---
        stdscr.addstr(cur_y, 1, vm_details_title)
        cur_y += 1
        top_border = "┌" + "┬".join("─" * w for w in vm_details_widths) + "┐"
        header_row = "│" + "│".join(get_display_width(truncate_with_ellipsis(h, w), w) for h, w in zip(vm_details_header, vm_details_widths)) + "│"
        divider = "├" + "┼".join("─" * w for w in vm_details_widths) + "┤"
        data_row = "│" + "│".join(get_display_width(truncate_with_ellipsis(ensure_non_empty(val), w), w) for val, w in zip(vm_details_row, vm_details_widths)) + "│"
        footer = "└" + "┴".join("─" * w for w in vm_details_widths) + "┘"
        stdscr.addstr(cur_y, 1, top_border); cur_y += 1
        stdscr.addstr(cur_y, 1, header_row); cur_y += 1
        stdscr.addstr(cur_y, 1, divider); cur_y += 1
        stdscr.addstr(cur_y, 1, data_row); cur_y += 1
        stdscr.addstr(cur_y, 1, footer); cur_y += 2

        # --- [2] Network Details 테이블 출력 ---
        # 1) 항상 페이지 번호 계산
        net_page = (net_index // net_rows_per_page) + 1
        # 2) 2페이지 이상일 때만 번호 표시
        if total_net_pages > 1:
            page_str = f"{net_page}/{total_net_pages}"
            net_title_line = get_display_width(
                f"- Network Details for {vm.name}",
                121 - len(page_str)
            ) + page_str
        else:
            # 페이지 번호 없이 제목만 121칸에 맞춤
            net_title_line = get_display_width(
                f"- Network Details for {vm.name}",
                121
            )
         
        stdscr.addstr(cur_y, 1, net_title_line); cur_y += 1
        net_top = "┌" + "┬".join("─" * w for w in nic_widths) + "┐"
        stdscr.addstr(cur_y, 1, net_top); cur_y += 1
        net_header_line = "│" + "│".join(get_display_width(truncate_with_ellipsis(h, w), w) for h, w in zip(nic_header, nic_widths)) + "│"
        stdscr.addstr(cur_y, 1, net_header_line); cur_y += 1
        net_divider = "├" + "┼".join("─" * w for w in nic_widths) + "┤"
        stdscr.addstr(cur_y, 1, net_divider); cur_y += 1
        net_start = (net_page - 1) * net_rows_per_page
        net_end = min(net_start + net_rows_per_page, net_total)
        for idx, row in enumerate(nics_data[net_start:net_end]):
            row_text = "│" + "│".join(get_display_width(truncate_with_ellipsis(str(row_val), w), w) for row_val, w in zip(row, nic_widths)) + "│"
            # 네트워크 테이블은 포커스 기능 적용 여부에 따라 강조함
            if net_focusable and focus == 0:
                if (net_start + idx) == net_index:
                    stdscr.attron(curses.color_pair(1))
                    stdscr.addstr(cur_y, 1, row_text)
                    stdscr.attroff(curses.color_pair(1))
                else:
                    stdscr.addstr(cur_y, 1, row_text)
            else:
                stdscr.addstr(cur_y, 1, row_text)
            cur_y += 1
        stdscr.addstr(cur_y, 1, "└" + "┴".join("─" * w for w in nic_widths) + "┘"); cur_y += 2

        # --- [3] Disk Details 테이블 출력 ---
        disk_page = (disk_index // disk_rows_per_page) + 1
        if total_disk_pages > 1:
            page_str = f"{disk_page}/{total_disk_pages}"
            disk_title_line = get_display_width(
                f"- Disk Details for {vm.name}",
                121 - len(page_str)
            ) + page_str
        else:
            disk_title_line = get_display_width(
                f"- Disk Details for {vm.name}",
                121
            )

        stdscr.addstr(cur_y, 1, disk_title_line)
        cur_y += 1

        disk_top = "┌" + "┬".join("─" * w for w in disk_widths) + "┐"
        stdscr.addstr(cur_y, 1, disk_top); cur_y += 1
        disk_header_line = "│" + "│".join(get_display_width(truncate_with_ellipsis(h, w), w) for h, w in zip(disk_header, disk_widths)) + "│"
        stdscr.addstr(cur_y, 1, disk_header_line); cur_y += 1
        disk_divider = "├" + "┼".join("─" * w for w in disk_widths) + "┤"
        stdscr.addstr(cur_y, 1, disk_divider); cur_y += 1
        disk_start = (disk_page - 1) * disk_rows_per_page
        disk_end = min(disk_start + disk_rows_per_page, total_disks)
        for idx in range(disk_start, disk_end):
            row = disk_data[idx]
            row_text = "│" + "│".join(get_display_width(truncate_with_ellipsis(ensure_non_empty(str(val)), disk_widths[i]), disk_widths[i]) for i, val in enumerate(row)) + "│"
            # 디스크 테이블은 항상 인터랙티브하므로 포커스 기능 적용
            if focus == 1:
                if idx == disk_index:
                    stdscr.attron(curses.color_pair(1))
                    stdscr.addstr(cur_y, 1, row_text)
                    stdscr.attroff(curses.color_pair(1))
                else:
                    stdscr.addstr(cur_y, 1, row_text)
            else:
                stdscr.addstr(cur_y, 1, row_text)
            cur_y += 1
        stdscr.addstr(cur_y, 1, "└" + "┴".join("─" * w for w in disk_widths) + "┘"); cur_y += 2

        # --- [4] Events 테이블 출력 ---
        # Disk Details 테이블 아래부터 최대 43행까지 표시하도록 조정
        disk_details_end_y = cur_y
        max_events_bottom_row = 43
        available_rows = max_events_bottom_row - disk_details_end_y
        adjusted_event_page_size = available_rows - 5  # 테두리, 헤더, 구분선 등 고려
        if adjusted_event_page_size < 1:
            adjusted_event_page_size = 1
        total_event_pages = math.ceil(len(events) / adjusted_event_page_size) if len(events) > 0 else 1
        current_event_page = event_index // adjusted_event_page_size

        events_y = cur_y

        event_page = (event_index // adjusted_event_page_size) + 1
        if total_event_pages > 1:
            page_str = f"{event_page}/{total_event_pages}"
            header_text = get_display_width(
                f"- Events for {vm.name}",
                121 - len(page_str)
            ) + page_str
        else:
            header_text = get_display_width(
                f"- Events for {vm.name}",
                121
            )

        stdscr.addstr(events_y, 1, header_text)
        events_y += 1

        event_top = "┌" + "┬".join("─" * w for w in event_widths) + "┐"
        stdscr.addstr(events_y, 1, event_top)
        events_y += 1

        # 헤더 출력: get_display_width 함수를 이용해 각 셀을 고정폭 문자열로 변환
        event_header_line = "│" + "│".join(get_display_width(h, w) for h, w in zip(event_header, event_widths)) + "│"
        stdscr.addstr(events_y, 1, event_header_line)
        events_y += 1

        event_divider = "├" + "┼".join("─" * w for w in event_widths) + "┤"
        stdscr.addstr(events_y, 1, event_divider)
        events_y += 1

        start_idx_event = current_event_page * adjusted_event_page_size
        end_idx_event = min(start_idx_event + adjusted_event_page_size, len(events))
        for idx in range(start_idx_event, end_idx_event):
            evt = events[idx]
            time_str = evt.time.strftime("%Y-%m-%d %H:%M:%S") if evt.time else "-"
            severity = evt.severity.name if hasattr(evt.severity, "name") else "-"
            description = evt.description if evt.description else "-"

            # 각 셀을 get_display_width 함수를 통해 지정한 폭으로 맞춤
            row_text = "│" + "│".join([
                get_display_width(time_str, event_widths[0]),
                get_display_width(severity, event_widths[1]),
                get_display_width(description, event_widths[2])
            ]) + "│"
            # 이벤트 테이블은 항상 인터랙티브하므로 포커스 기능 적용
            if focus == 2:
                if idx == event_index:
                    stdscr.attron(curses.color_pair(1))
                    stdscr.addstr(events_y, 1, row_text)
                    stdscr.attroff(curses.color_pair(1))
                else:
                    stdscr.addstr(events_y, 1, row_text)
            else:
                stdscr.addstr(events_y, 1, row_text)
            events_y += 1

        stdscr.addstr(events_y, 1, "└" + "┴".join("─" * w for w in event_widths) + "┘")

        # --- [5] 하단 내비게이션 출력 ---
        left_nav = "TAB=Switch Focus | ▲/▼=Navigate | ENTER=View Details | ESC=Go back | Q=Quit"
        paginated = ((total_net_pages > 1) or (total_disk_pages > 1) or (total_event_pages > 1))
        right_nav = "N=Next | P=Prev" if paginated else ""
        total_width_nav = 121
        gap = total_width_nav - (len(left_nav) + len(right_nav))
        if gap < 1:
            gap = 1
        nav_line = left_nav + (" " * gap) + right_nav
        stdscr.addstr(height - 1, 1, nav_line)
        stdscr.refresh()

        key = stdscr.getch()
        if key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key == 27:
            break
        elif key == 9:  # TAB 키: 현재 인터랙티브한 테이블만 대상으로 포커스 전환
            interactive_indices = []
            if net_focusable:
                interactive_indices.append(0)
            if disk_focusable:
                interactive_indices.append(1)
            if events_focusable:
                interactive_indices.append(2)
            if interactive_indices:
                if focus not in interactive_indices:
                    focus = interactive_indices[0]
                else:
                    current_pos = interactive_indices.index(focus)
                    next_pos = (current_pos + 1) % len(interactive_indices)
                    focus = interactive_indices[next_pos]
        elif key == curses.KEY_UP:
            if focus == 0 and net_focusable:
                if net_index > 0:
                    net_index -= 1
                else:
                    net_index = len(nics_data) - 1
            elif focus == 1 and disk_focusable:
                if disk_index > 0:
                    disk_index -= 1
                else:
                    disk_index = len(disk_data) - 1
            elif focus == 2 and events_focusable:
                if event_index > 0:
                    event_index -= 1
                else:
                    event_index = len(events) - 1
        elif key == curses.KEY_DOWN:
            if focus == 0 and net_focusable:
                if net_index < len(nics_data) - 1:
                    net_index += 1
                else:
                    net_index = 0
            elif focus == 1 and disk_focusable:
                if disk_index < len(disk_data) - 1:
                    disk_index += 1
                else:
                    disk_index = 0
            elif focus == 2 and events_focusable:
                if event_index < len(events) - 1:
                    event_index += 1
                else:
                    event_index = 0
        elif key in (ord('n'), ord('N')):
            if focus == 0 and net_focusable:
                if (net_index // net_rows_per_page) < (total_net_pages - 1):
                    net_index = ((net_index // net_rows_per_page) + 1) * net_rows_per_page
                else:
                    net_index = 0
            elif focus == 1 and disk_focusable:
                if (disk_index // disk_rows_per_page) < (total_disk_pages - 1):
                    disk_index = ((disk_index // disk_rows_per_page) + 1) * disk_rows_per_page
                else:
                    disk_index = 0
            elif focus == 2 and events_focusable:
                if (event_index // adjusted_event_page_size) < (total_event_pages - 1):
                    event_index = ((event_index // adjusted_event_page_size) + 1) * adjusted_event_page_size
                else:
                    event_index = 0
        elif key in (ord('p'), ord('P')):
            if focus == 0 and net_focusable:
                if (net_index // net_rows_per_page) > 0:
                    net_index = ((net_index // net_rows_per_page) - 1) * net_rows_per_page
                else:
                    net_index = (total_net_pages - 1) * net_rows_per_page
            elif focus == 1 and disk_focusable:
                if (disk_index // disk_rows_per_page) > 0:
                    disk_index = ((disk_index // disk_rows_per_page) - 1) * disk_rows_per_page
                else:
                    disk_index = (total_disk_pages - 1) * disk_rows_per_page
            elif focus == 2 and events_focusable:
                if (event_index // adjusted_event_page_size) > 0:
                    event_index = ((event_index // adjusted_event_page_size) - 1) * adjusted_event_page_size
                else:
                    event_index = (total_event_pages - 1) * adjusted_event_page_size
        elif key == 10:  # ENTER 키
            if focus == 1:
                if total_disks > 0 and disk_index < len(disk_objects):
                    disk_obj = disk_objects[disk_index]
                    if disk_obj:
                        show_disk_detail_popup(stdscr, disk_obj)
            elif focus == 2:
                if len(events) > 0 and event_index < len(events):
                    selected_evt = events[event_index]
                    popup_height = min(height - 4, 20)
                    popup_width = min(width - 4, 100)
                    popup_y = (height - popup_height) // 2
                    popup_x = (width - popup_width) // 2
                    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
                    popup.keypad(True)
                    popup.border()
                    tstr = selected_evt.time.strftime("%Y-%m-%d %H:%M:%S") if selected_evt.time else "-"
                    sev = selected_evt.severity.name if hasattr(selected_evt.severity, "name") else "-"
                    desc = selected_evt.description if selected_evt.description else "-"
                    popup.addstr(1, 2, f"Time: {tstr}")
                    popup.addstr(2, 2, f"Severity: {sev}")
                    wrapped = textwrap.wrap(desc, popup_width - 4)
                    for i, line in enumerate(wrapped):
                        if i + 3 < popup_height - 2:
                            popup.addstr(i + 3, 2, line)
                    msg = "Press any key to close"
                    x_pos = (popup_width - len(msg)) // 2
                    popup.addstr(popup_height - 2, x_pos, msg, curses.A_DIM)
                    popup.refresh()
                    popup.getch()
                    popup.clear()
                    popup.refresh()
            elif focus == 0:
                # 네트워크 테이블은 기본적으로 ENTER 동작이 없음.
                pass
        else:
            pass

    stdscr.clear()
    stdscr.refresh()

def show_disk_detail_popup(stdscr, disk):
    """
    디스크 상세 정보를 팝업 창으로 표시하는 함수
    disk는 디스크 상세 정보를 담은 딕셔너리임
    """
    height, width = stdscr.getmaxyx()
    popup_height = min(20, height - 4)
    popup_width = min(100, width - 4)
    popup_y = (height - popup_height) // 2
    popup_x = (width - popup_width) // 2
    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)
    popup.clear()
    popup.border()

    title = f"Disk Details: {disk.get('name', '-')}"
    popup.addstr(1, (popup_width - len(title)) // 2, title, curses.A_DIM)

    # 표시할 필드 목록
    fields = [
        ("Name", disk.get("name", "N/A")),
        ("Alias", disk.get("alias", "N/A")),
        ("Size (GB)", disk.get("size", "N/A")),
        ("Storage Domain", disk.get("storage_domain", "N/A")),
        ("VM Name", disk.get("vm_name", "N/A")),
        ("Content Type", disk.get("content_type", "N/A")),
        ("ID", disk.get("id", "N/A")),
        ("Description", disk.get("description", "N/A")),
        ("Disk Profile", disk.get("disk_profile", "N/A")),
        ("Wipe After Delete", disk.get("wipe_after_delete", "N/A")),
        ("Virtual Size (GB)", disk.get("virtual_size", "N/A")),
        ("Actual Size (GB)", disk.get("actual_size", "N/A")),
        ("Allocation Policy", disk.get("allocation_policy", "N/A"))
    ]
    row = 3
    for field, value in fields:
        line = f"{field}: {value}"
        wrapped = textwrap.wrap(line, popup_width - 4)
        for wline in wrapped:
            if row < popup_height - 2:
                popup.addstr(row, 2, wline)
                row += 1
    footer = "Press any key to close"
    popup.addstr(popup_height - 2, (popup_width - len(footer)) // 2, footer, curses.A_DIM)
    popup.refresh()
    popup.getch()

# =============================================================================
# Section 5: Data Center Section
# =============================================================================
def fetch_events_data_center(connection, data_center, result):
    try:
        events_service = connection.system_service().events_service()
        all_events = events_service.list()
        # 선택된 데이터 센터와 관련된 이벤트만 필터링
        events = [event for event in all_events if event.data_center and event.data_center.id == data_center.id]
        result['events'] = events
    except Exception as e:
        result['error'] = str(e)

def show_event_detail_popup(stdscr, event):
    import textwrap, sys
    # 팝업창 크기 및 스타일 (다른 이벤트 팝업창과 동일)
    height, width = stdscr.getmaxyx()
    BOX_WIDTH = 101  # 팝업창 너비
    BOX_HEIGHT = min(20, height - 4)
    popup_y = (height - BOX_HEIGHT) // 2
    popup_x = (width - BOX_WIDTH) // 2
    popup = curses.newwin(BOX_HEIGHT, BOX_WIDTH, popup_y, popup_x)
    popup.keypad(True)
    popup.border()
    title = "Event Detail"
    popup.addstr(1, (BOX_WIDTH - len(title)) // 2, title, curses.A_NORMAL)
    event_time = event.time.strftime('%Y-%m-%d %H:%M:%S') if event.time else "-"
    severity = getattr(event.severity, 'name', str(event.severity)) if event.severity else "-"
    description = event.description if event.description else "-"
    content_lines = []
    content_lines.append(f"Time: {event_time}")
    content_lines.append(f"Severity: {severity}")
    content_lines.append("Description:")
    wrapped = textwrap.wrap(description, BOX_WIDTH - 4)
    content_lines.extend(wrapped)
    start_line = 3
    for i, line in enumerate(content_lines):
        if start_line + i < BOX_HEIGHT - 2:
            popup.addstr(start_line + i, 2, line)
    footer = "Press any key to close"
    popup.addstr(BOX_HEIGHT - 2, (BOX_WIDTH - len(footer)) // 2, footer, curses.A_DIM)
    popup.refresh()
    popup.getch()
    popup.clear()
    stdscr.touchwin()
    stdscr.refresh()

def show_events_data_center(stdscr, connection, data_center):
    # 초기 정렬 상태 변수 (None: 정렬 미적용, 각 키별 기본 오름차순 True)
    current_sort_key = None
    sort_orders = {"T": True, "W": True, "E": True}

    def fetch_and_update():
        nonlocal events, total_events, total_pages, selected_global
        result = {}
        fetch_thread = threading.Thread(target=fetch_events_data_center, args=(connection, data_center, result))
        fetch_thread.start()
        spinner_chars = ['|', '/', '-', '\\']
        spinner_index = 0
        stdscr.nodelay(True)
        while fetch_thread.is_alive():
            stdscr.erase()
            stdscr.addstr(1, 1, f"Loading events... {spinner_chars[spinner_index]}", curses.A_NORMAL)
            stdscr.refresh()
            spinner_index = (spinner_index + 1) % len(spinner_chars)
            time.sleep(0.1)
        fetch_thread.join()
        stdscr.nodelay(False)
        if 'error' in result:
            stdscr.addstr(2, 1, f"Failed to fetch Events: {result['error']}")
            stdscr.refresh()
            stdscr.getch()
            return False
        # 기존 in-place 업데이트 대신, 새로운 리스트로 할당하여 최신 이벤트 목록 반영
        events = result.get('events', [])
        total_events = len(events)
        total_pages = math.ceil(total_events / rows_per_page) if total_events > 0 else 1
        selected_global = 0
        return True

    # 초기 이벤트 가져오기
    events = []
    rows_per_page = 37  # 한 페이지에 표시할 행 수
    total_events = 0
    total_pages = 1
    selected_global = 0

    if not fetch_and_update():
        return

    stdscr.keypad(True)
    while True:
        stdscr.erase()
        current_page = selected_global // rows_per_page
        local_index = selected_global % rows_per_page

        # 헤더: Data Center 이름과 페이지 정보 (총 폭 121)
        header_title = f"- Events for {data_center.name}"
        if total_pages > 1:
            page_info = f"{current_page+1}/{total_pages}"
            header_line = header_title.ljust(121 - len(page_info)) + page_info
        else:
            header_line = header_title.ljust(121)
        stdscr.addstr(1, 1, header_line[:121])

        # 테이블 그리기 (열 폭: 시간 19, 심각도 9, 설명 89)
        col_widths = [19, 9, 89]
        top_border = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
        divider_line = "├" + "┼".join("─" * w for w in col_widths) + "┤"
        footer_line = "└" + "┴".join("─" * w for w in col_widths) + "┘"
        stdscr.addstr(2, 1, top_border)
        
        header_cols = ["Time", "Severity", "Description"]
        header_row = "│" + "│".join(get_display_width(str(h), w) for h, w in zip(header_cols, col_widths)) + "│"
        stdscr.addstr(3, 1, header_row)
        stdscr.addstr(4, 1, divider_line)
        
        # 현재 페이지 이벤트 출력 및 선택된 행 강조
        start_idx = current_page * rows_per_page
        end_idx = min(start_idx + rows_per_page, total_events)
        data_row = 5
        current_page_events = events[start_idx:end_idx]
        for idx, event in enumerate(current_page_events):
            time_str = event.time.strftime("%Y-%m-%d %H:%M:%S") if event.time else "-"
            severity = event.severity.name if (hasattr(event.severity, "name") and event.severity.name) else "-"
            description = event.description if event.description else "-"
            row_str = "│" + "│".join([
                get_display_width(time_str, col_widths[0]),
                get_display_width(severity, col_widths[1]),
                get_display_width(description, col_widths[2])
            ]) + "│"
            if idx == local_index:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(data_row, 1, row_str)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(data_row, 1, row_str)
            data_row += 1

        if end_idx == start_idx:
            row_str = "│" + "│".join(get_display_width("-", w) for w in col_widths) + "│"
            stdscr.addstr(data_row, 1, row_str)
            data_row += 1

        stdscr.addstr(data_row, 1, footer_line)

        # 하단에 정렬/새로고침 안내 문구 추가
        height, width = stdscr.getmaxyx()
        instruction_line = "T=Time | W=WARNING | E=ERROR | R=Refresh"
        stdscr.addstr(height - 2, 1, instruction_line, curses.A_NORMAL)

        nav_left = "ESC=Go Back | Q=Quit"
        nav_right = "N=Next | P=Prev" if total_pages > 1 else ""
        spaces = " " * max(121 - len(nav_left) - len(nav_right), 1)
        stdscr.addstr(height - 1, 1, nav_left + spaces + nav_right, curses.A_NORMAL)
        
        stdscr.refresh()
        key = stdscr.getch()

        # 방향키 및 페이지 이동 처리
        if key in (curses.KEY_UP,):
            if selected_global > 0:
                selected_global -= 1
            else:
                selected_global = total_events - 1
        elif key in (curses.KEY_DOWN,):
            if selected_global < total_events - 1:
                selected_global += 1
            else:
                selected_global = 0
        elif key in (ord('n'), ord('N')) and total_pages > 1 and current_page < total_pages - 1:
            selected_global += rows_per_page
        elif key in (ord('p'), ord('P')) and total_pages > 1 and current_page > 0:
            selected_global -= rows_per_page
        # 엔터키: 상세 이벤트 팝업 표시
        elif key in (10, 13):
            if current_page_events and 0 <= local_index < len(current_page_events):
                selected_event = current_page_events[local_index]
                show_event_detail_popup(stdscr, selected_event)
        # 정렬/새로고침 기능 (대소문자 구분 없이)
        elif key in (ord('t'), ord('T')):
            if current_sort_key == "T":
                sort_orders["T"] = not sort_orders["T"]
            else:
                current_sort_key = "T"
                sort_orders["T"] = True  # 기본 오름차순
            events.sort(key=lambda e: e.time if e.time else datetime.min, reverse=(not sort_orders["T"]))
            selected_global = 0
        elif key in (ord('w'), ord('W')):
            if current_sort_key == "W":
                sort_orders["W"] = not sort_orders["W"]
            else:
                current_sort_key = "W"
                sort_orders["W"] = True
            events.sort(key=lambda e: 0 if (hasattr(e.severity, "name") and e.severity.name.upper() == "WARNING") else 1,
                        reverse=(not sort_orders["W"]))
            selected_global = 0
        elif key in (ord('e'), ord('E')):
            if current_sort_key == "E":
                sort_orders["E"] = not sort_orders["E"]
            else:
                current_sort_key = "E"
                sort_orders["E"] = True
            events.sort(key=lambda e: 0 if (hasattr(e.severity, "name") and e.severity.name.upper() == "ERROR") else 1,
                        reverse=(not sort_orders["E"]))
            selected_global = 0
        elif key in (ord('r'), ord('R')):
            # Refresh: 이벤트를 새로 가져오고 정렬 상태 초기화
            current_sort_key = None
            sort_orders = {"T": True, "W": True, "E": True}
            if not fetch_and_update():
                return
        elif key == 27:  # ESC 키
            break
        elif key in (ord('q'), ord('Q')):
            import sys
            sys.exit(0)

def show_data_centers(stdscr, connection):
    """
    Data Centers 목록과 선택된 Data Center에 대해
      - Cluster For <Data Center> 테이블: 한 페이지당 4개 항목
      - Logical Network For <Data Center> 테이블: 고정 페이지 크기(예, 4개)
      - Storage Domain For <Data Center> 테이블: Logical Networks 테이블 바로 아래부터 터미널의 43번째 행까지 표시 가능한
        데이터 행 수를 계산하여 페이지 크기를 설정하며, 2페이지 이상일 경우 헤더 오른쪽에 페이지 번호를 123번째 칸에 고정하여 표시
    """
    # ── curses 기본 설정 및 색상 쌍 초기화 (Virtual Machines Section와 동일)
    init_curses_colors()  # Section 4의 색상 초기화 함수를 호출
    stdscr.timeout(5)
    try:
        dcs_service = connection.system_service().data_centers_service()
        dcs = list(dcs_service.list())
        clusters_service = connection.system_service().clusters_service()
        clusters = list(clusters_service.list())
        hosts_service = connection.system_service().hosts_service()
        hosts = list(hosts_service.list())
        networks_service = connection.system_service().networks_service()
    except Exception as e:
        stdscr.addstr(2, 1, f"Failed to fetch Data Center: {e}")
        stdscr.refresh()
        stdscr.getch()
        return

    # 초기 페이징 및 포커스 변수 설정
    dc_page, dc_page_size, dc_selected = 0, 4, 0
    cluster_page, cluster_page_size, cluster_selected = 0, 4, 0   # 한 페이지당 4개 항목
    network_page, network_page_size, network_selected = 0, 4, 0
    storage_page, storage_selected = 0, 0  # storage_page_size는 동적 계산
    focus = 0  # 0: Data Center 목록, 1: Cluster, 2: Logical Network, 3: Storage Domain
    prev_dc_id = None
    cached_clusters = []
    # Logical Networks의 원본 네트워크 객체 리스트 저장
    cached_networks = []
    cached_storage = []

    # ── 보조 함수들 ──
    def draw_title_with_page(y, title, current_page, total_pages, total_width=121):
        if total_pages > 1:
            page_text = f"{current_page+1}/{total_pages}"
            full_text = title.ljust(total_width - len(page_text)) + page_text
        else:
            full_text = title.ljust(total_width)
        stdscr.addstr(y, 1, full_text[:total_width])
    
    def draw_simple_table(start_y, headers, col_widths, data, selected_index_in_page=None, highlight=False):
        # ── 테두리 상단
        top_border = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
        stdscr.addstr(start_y, 1, top_border)
        # ── 헤더 행 (get_display_width 사용)
        header_cells = [get_display_width(str(h), w) for h, w in zip(headers, col_widths)]
        header_row = "│" + "│".join(header_cells) + "│"
        stdscr.addstr(start_y + 1, 1, header_row)
        # ── 헤더/데이터 구분선
        divider = "├" + "┼".join("─" * w for w in col_widths) + "┤"
        stdscr.addstr(start_y + 2, 1, divider)
    
        # ── 데이터 행
        row_y = start_y + 3
        if not data:
            # 데이터가 없을 때 빈 행
            empty_cells = ["-".ljust(w) for w in col_widths]
            empty_row = "│" + "│".join(empty_cells) + "│"
            stdscr.addstr(row_y, 1, empty_row)
            row_y += 1
        else:
            for i, row in enumerate(data):
                cell_texts = [get_display_width(str(cell), w) for cell, w in zip(row, col_widths)]
                row_line = "│" + "│".join(cell_texts) + "│"
                if highlight and selected_index_in_page is not None and i == selected_index_in_page:
                    stdscr.attron(curses.color_pair(1))
                    stdscr.addstr(row_y, 1, row_line)
                    stdscr.attroff(curses.color_pair(1))
                else:
                    stdscr.addstr(row_y, 1, row_line)
                row_y += 1
    
        # ── 테두리 하단
        footer = "└" + "┴".join("─" * w for w in col_widths) + "┘"
        stdscr.addstr(row_y, 1, footer)
    
        return row_y - start_y + 1


    # ── 메인 루프 ──
    while True:
        stdscr.erase()
        height, width = stdscr.getmaxyx()
        if height < 43 or width < 123:
            stdscr.addstr(0, 0, "Resize the terminal to at least 123x43.")
            stdscr.refresh()
            continue

        current_row = 1

        # [0] Data Center List 테이블
        total_dc = len(dcs)
        total_dc_pages = max(1, math.ceil(total_dc / dc_page_size))
        if dc_page >= total_dc_pages:
            dc_page = total_dc_pages - 1
        if dc_selected >= total_dc:
            dc_selected = total_dc - 1 if total_dc > 0 else 0
        # 두 번째 칸(즉, current_row == 1)에 굵은 글씨체로 'Data Center' 추가
        stdscr.addstr(current_row, 1, "■ Data Center", curses.A_BOLD)
        current_row += 1
        stdscr.addstr(current_row, 1, "")  # 빈 줄 추가
        current_row += 1
        draw_title_with_page(current_row, "- Data Center List", dc_page, total_dc_pages, total_width=121)

        current_row += 1
        dc_headers = ["Data Center Name", "Comment", "Status", "Hosts", "Clusters", "Description"]
        dc_col_widths = [28, 21, 16, 13, 13, 23]
        start_idx = dc_page * dc_page_size
        end_idx = start_idx + dc_page_size
        page_dcs = []
        for dc in dcs[start_idx:end_idx]:
            dc_clusters = [c for c in clusters if c.data_center and c.data_center.id == dc.id]
            dc_hosts = [h for h in hosts if h.cluster and h.cluster.id in [c.id for c in dc_clusters]]
            row = [
                ensure_non_empty(dc.name),
                adjust_column_width(ensure_non_empty(dc.comment), 21),
                ensure_non_empty(dc.status.name if dc.status else "-"),
                ensure_non_empty(str(len(dc_hosts))),
                ensure_non_empty(str(len(dc_clusters))),
                adjust_column_width(ensure_non_empty(dc.description), 23)
            ]
            page_dcs.append(row)
        dc_sel_in_page = dc_selected - start_idx if dc_selected >= start_idx and dc_selected < end_idx else None
        table_height = draw_simple_table(
            start_y=current_row,
            headers=dc_headers,
            col_widths=dc_col_widths,
            data=page_dcs,
            selected_index_in_page=dc_sel_in_page,
            highlight=(focus==0)
        )
        current_row += table_height + 1

        selected_dc = dcs[dc_selected] if total_dc > 0 else None

        # 선택된 Data Center가 바뀌면 관련 정보 캐시 재계산
        if selected_dc:
            if prev_dc_id is None or selected_dc.id != prev_dc_id:
                cached_clusters = [
                    [cl.name if cl.name else "N/A",
                     (f"{cl.version.major}.{cl.version.minor}" if cl.version and hasattr(cl.version, 'major') and hasattr(cl.version, 'minor') else "N/A"),
                     cl.comment if cl.comment else "N/A"]
                    for cl in clusters if cl.data_center and cl.data_center.id == selected_dc.id
                ]
                try:
                    # Logical Networks: 원본 네트워크 객체 저장
                    cached_networks = networks_service.list(search=f"datacenter={selected_dc.name}")
                except Exception:
                    cached_networks = []
                try:
                    dc_service = connection.system_service().data_centers_service().data_center_service(selected_dc.id)
                    cached_storage = [
                        [sd.name if sd.name else "N/A",
                         str(sd.status) if sd.status else "N/A",
                         f"{(sd.available / (1024**3)):.1f}" if hasattr(sd, 'available') and sd.available is not None else "0.0",
                         f"{(sd.used / (1024**3)):.1f}" if hasattr(sd, 'used') and sd.used is not None else "0.0",
                         f"{(sd.total / (1024**3)):.1f}" if hasattr(sd, 'total') and sd.total is not None else f"{((sd.available or 0)+(sd.used or 0))/(1024**3):.1f}",
                         sd.comment if sd.comment else "N/A"
                        ]
                        for sd in dc_service.storage_domains_service().list()
                    ]
                except Exception:
                    cached_storage = []
                prev_dc_id = selected_dc.id
                # 하위 테이블의 선택 인덱스 및 페이지 초기화
                cluster_selected = 0; network_selected = 0; storage_selected = 0
                cluster_page = 0; network_page = 0; storage_page = 0
        else:
            cached_clusters = []; cached_networks = []; cached_storage = []

        # [1] Cluster For <Data Center> 테이블 (한 페이지당 4개)
        total_clusters = len(cached_clusters)
        total_cluster_pages = max(1, math.ceil(total_clusters / cluster_page_size))
        if cluster_page >= total_cluster_pages:
            cluster_page = total_cluster_pages - 1
        if cluster_selected >= total_clusters:
            cluster_selected = total_clusters - 1 if total_clusters > 0 else 0
        title_cluster = f"- Cluster For {selected_dc.name}" if selected_dc else "- Cluster"
        draw_title_with_page(current_row, title_cluster, cluster_page, total_cluster_pages, total_width=123)
        current_row += 1
        cluster_headers = ["Name", "Compat Version", "Description"]
        cluster_col_widths = [28, 32, 57]
        start_idx = cluster_page * cluster_page_size
        end_idx = start_idx + cluster_page_size
        page_clusters = cached_clusters[start_idx:end_idx]
        cluster_sel_in_page = cluster_selected - start_idx if cluster_selected >= start_idx and cluster_selected < end_idx else None
        table_height = draw_simple_table(current_row, cluster_headers, cluster_col_widths, page_clusters, cluster_sel_in_page, highlight=(focus==1))
        current_row += table_height + 1

        # [2] Logical Networks For <Data Center> 테이블 (한 페이지당 4개)
        total_networks = len(cached_networks)
        total_network_pages = max(1, math.ceil(total_networks / network_page_size))
        if network_page >= total_network_pages:
            network_page = total_network_pages - 1
        if network_selected >= total_networks:
            network_selected = total_networks - 1 if total_networks > 0 else 0
        title_network = f"- Logical Network For {selected_dc.name}" if selected_dc else "- Logical Network"
        draw_title_with_page(current_row, title_network, network_page, total_network_pages, total_width=121)
        current_row += 1
        network_headers = ["Name", "Description"]
        network_col_widths = [28, 90]
        start_idx = network_page * network_page_size
        end_idx = start_idx + network_page_size
        page_networks = [
            [net.name or "N/A", net.comment or "N/A"]
            for net in cached_networks[start_idx:end_idx]
        ]
        network_sel_in_page = network_selected - start_idx if network_selected >= start_idx and network_selected < end_idx else None
        table_height = draw_simple_table(current_row, network_headers, network_col_widths, page_networks, network_sel_in_page, highlight=(focus==2))
        current_row += table_height + 1

        # [3] Storage Domains For <Data Center> 테이블 (동적 페이지 크기)
        total_storage = len(cached_storage)
        available_rows = 43 - current_row
        storage_page_size = max(available_rows - 4, 1)
        total_storage_pages = max(1, math.ceil(total_storage / storage_page_size))
        if storage_page >= total_storage_pages:
            storage_page = total_storage_pages - 1
        if storage_selected >= total_storage:
            storage_selected = total_storage - 1 if total_storage > 0 else 0
        title_storage = f"- Storage Domain For {selected_dc.name}" if selected_dc else "- Storage Domains"
        draw_title_with_page(current_row, title_storage, storage_page, total_storage_pages, total_width=121)
        current_row += 1
        storage_headers = ["Name", "Status", "Free Space (GB)", "Used Space (GB)", "Total Space (GB)", "Description"]
        storage_col_widths = [28, 13, 17, 17, 17, 22]
        start_idx = storage_page * storage_page_size
        end_idx = start_idx + storage_page_size
        page_storage = cached_storage[start_idx:end_idx]
        storage_sel_in_page = storage_selected - start_idx if storage_selected >= start_idx and storage_selected < end_idx else None
        table_height = draw_simple_table(current_row, storage_headers, storage_col_widths, page_storage, storage_sel_in_page, highlight=(focus==3))
        current_row += table_height + 1

        # 하단 상태바
        if total_dc_pages > 1 or total_cluster_pages > 1 or total_network_pages > 1 or total_storage_pages > 1:
            right_status = "N=Next | P=Prev"
        else:
            right_status = ""
        left_status = "TAB=Switch Focus | ▲/▼=Navigate | Enter=View Events or Details | ESC=Go back | Q=Quit"
        draw_status_bar(stdscr, height-1, left_status, right_status, total_width=121)

        stdscr.refresh()
        key = stdscr.getch()
        if key == -1:
            continue
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key == 27:
            break 
        elif key == 9:  # TAB 키: 포커스 전환
            focus = (focus + 1) % 4
            for _ in range(4):
                if (focus == 0 and total_dc > 0) or (focus == 1 and total_clusters > 0) or \
                   (focus == 2 and total_networks > 0) or (focus == 3 and total_storage > 0):
                    break
                focus = (focus + 1) % 4
            if focus == 1:
                cluster_selected = 0
            elif focus == 2:
                network_selected = 0
            elif focus == 3:
                storage_selected = 0
        elif key == curses.KEY_UP:
            if focus == 0 and total_dc > 0:
                if dc_selected == 0:
                    dc_selected = total_dc - 1
                    dc_page = total_dc_pages - 1
                else:
                    dc_selected -= 1
                    if dc_selected < dc_page * dc_page_size:
                        dc_page -= 1
            elif focus == 1 and total_clusters > 0:
                if cluster_selected == 0:
                    cluster_selected = total_clusters - 1
                    cluster_page = total_cluster_pages - 1
                else:
                    cluster_selected -= 1
                    if cluster_selected < cluster_page * cluster_page_size:
                        cluster_page -= 1
            elif focus == 2 and total_networks > 0:
                if network_selected == 0:
                    network_selected = total_networks - 1
                    network_page = total_network_pages - 1
                else:
                    network_selected -= 1
                    if network_selected < network_page * network_page_size:
                        network_page -= 1
            elif focus == 3 and total_storage > 0:
                if storage_selected == 0:
                    storage_selected = total_storage - 1
                    storage_page = total_storage_pages - 1
                else:
                    storage_selected -= 1
                    if storage_selected < storage_page * storage_page_size:
                        storage_page -= 1
        elif key == curses.KEY_DOWN:
            if focus == 0 and total_dc > 0:
                if dc_selected == total_dc - 1:
                    dc_selected = 0
                    dc_page = 0
                else:
                    dc_selected += 1
                    if dc_selected >= (dc_page + 1) * dc_page_size:
                        dc_page += 1
            elif focus == 1 and total_clusters > 0:
                if cluster_selected == total_clusters - 1:
                    cluster_selected = 0
                    cluster_page = 0
                else:
                    cluster_selected += 1
                    if cluster_selected >= (cluster_page + 1) * cluster_page_size:
                        cluster_page += 1
            elif focus == 2 and total_networks > 0:
                if network_selected == total_networks - 1:
                    network_selected = 0
                    network_page = 0
                else:
                    network_selected += 1
                    if network_selected >= (network_page + 1) * network_page_size:
                        network_page += 1
            elif focus == 3 and total_storage > 0:
                if storage_selected == total_storage - 1:
                    storage_selected = 0
                    storage_page = 0
                else:
                    storage_selected += 1
                    if storage_selected >= (storage_page + 1) * storage_page_size:
                        storage_page += 1
        elif key in (ord('n'), ord('N')):
            if focus == 0 and dc_page < total_dc_pages - 1:
                dc_page += 1
                dc_selected = dc_page * dc_page_size
            elif focus == 1 and cluster_page < total_cluster_pages - 1:
                cluster_page += 1
                cluster_selected = cluster_page * cluster_page_size
            elif focus == 2 and network_page < total_network_pages - 1:
                network_page += 1
                network_selected = network_page * network_page_size
            elif focus == 3 and storage_page < total_storage_pages - 1:
                storage_page += 1
                storage_selected = storage_page * storage_page_size
        elif key in (ord('p'), ord('P')):
            if focus == 0 and dc_page > 0:
                dc_page -= 1
                dc_selected = dc_page * dc_page_size
            elif focus == 1 and cluster_page > 0:
                cluster_page -= 1
                cluster_selected = cluster_page * cluster_page_size
            elif focus == 2 and network_page > 0:
                network_page -= 1
                network_selected = network_page * network_page_size
            elif focus == 3 and storage_page > 0:
                storage_page -= 1
                storage_selected = storage_page * storage_page_size          
        elif key == 10:  # Enter 키
            if focus == 0 and selected_dc:
                show_events_data_center(stdscr, connection, selected_dc)
            elif focus == 1 and total_clusters > 0:
                selected_cluster = None
                for cl in clusters:
                    if cl.data_center and selected_dc and cl.data_center.id == selected_dc.id and cl.name == cached_clusters[cluster_selected][0]:
                        selected_cluster = cl
                        break
                if selected_cluster:
                    show_cluster_details_screen(stdscr, connection, selected_cluster)
            elif focus == 2 and total_networks > 0:
                selected_network_obj = cached_networks[network_selected]
                run_subview(stdscr, show_network_detail_screen, connection, selected_network_obj)
            elif focus == 3 and len(cached_storage) > 0:
                selected_storage = cached_storage[storage_selected][0]
                storage_info = fetch_storage_domains_data(connection)
                main_loop(stdscr, [selected_storage], storage_info)
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
    # end while

def show_cluster_details_screen(stdscr, connection, cluster):
    """
    선택한 클러스터(예, Default-Cluster)에 대해 아래와 같은 새 화면을 표시함
      - Cluster List for <Cluster Name> (단일 행)
      - Logical Network for <Cluster Name> (페이지네이션 및 포커스 적용)
      - Host for <Cluster Name> (페이지네이션 및 포커스 적용)
      - Virtual Machine for <Cluster Name> (Total ... VM, 페이지네이션 및 포커스 적용)
    하단에는 "TAB=Switch Focus | ▲/▼=Navigate | Enter=View Events or Details | ESC=Go back | Q=Quit   N=Next | P=Prev" 메시지가 표시됨
    """

    # --- Logical Network: 실제 oVirt 네트워크 객체 리스트 가져오기 ---
    def get_networks_by_cluster(cluster_id):
        """
        oVirt SDK를 이용해 클러스터 ID에 속한 네트워크 객체 목록을 반환
        오류가 발생하면 빈 리스트 반환
        """
        try:
            return connection.system_service() \
                             .clusters_service() \
                             .cluster_service(cluster_id) \
                             .networks_service() \
                             .list()
        except Exception:
            return []

    # 첫 화면 진입 시 Logical Network 객체 리스트 캐시
    cached_ln = get_networks_by_cluster(cluster.id)

    # --- Host & VMs 필터링 ---
    hosts_service = connection.system_service().hosts_service()
    all_hosts = hosts_service.list()
    cached_hosts = [
        [
            host.name or "N/A",
            safe_gethostbyname(host.address) if (hasattr(host, "address") and host.address) else "-",
            host.status.value if (hasattr(host, "status") and host.status) else "-",
            f"{sum(1 for vm in connection.system_service().vms_service().list() if (vm.host and vm.host.id == host.id))} VMs"
        ]
        for host in all_hosts if (host.cluster and host.cluster.id == cluster.id)
    ]

    vms_service = connection.system_service().vms_service()
    all_vms = vms_service.list()
    # 원본 VM 객체 캐시 (나중에 show_vm_details() 호출 시 사용)
    cached_cluster_vm_objects = [vm for vm in all_vms if (vm.cluster and vm.cluster.id == cluster.id)]
    # 디스플레이용 캐시 (목록에 표시할 문자열들)
    cached_cluster_vms = [
        [
            vm.name or "N/A",
            vm.status.value.lower() if (vm.status and hasattr(vm.status, 'value')) else "N/A",
            (f"{(int(time.time() - vm.start_time.timestamp()) // 86400)}d "
             f"{(int(time.time() - vm.start_time.timestamp()) % 86400 // 3600)}h "
             f"{((int(time.time() - vm.start_time.timestamp()) % 3600) // 60)}m")
            if (vm.start_time and vm.status and vm.status.value.lower() == "up") else "-",
            str(vm.cpu.topology.sockets * vm.cpu.topology.cores) if (vm.cpu and vm.cpu.topology) else "-",
            f"{int(vm.memory / (1024**2))} MB" if vm.memory else "-",
            "nic1",  # 예시 네트워크 정보
            "-"      # 예시 IP 주소
        ]
        for vm in all_vms if (vm.cluster and vm.cluster.id == cluster.id)
    ]

    # --- 클러스터 상세 정보 (단일 행) ---
    data_center_name = "-"
    if cluster.data_center:
        try:
            dc_obj = connection.follow_link(cluster.data_center)
            data_center_name = dc_obj.name if (dc_obj and hasattr(dc_obj, "name")) else "-"
        except Exception:
            data_center_name = "-"

    cpu_type = cluster.cpu.type if (cluster.cpu and hasattr(cluster.cpu, 'type')) else "N/A"
    hosts_count = len([h for h in all_hosts if (h.cluster and h.cluster.id == cluster.id)])
    vm_count = len([vm for vm in all_vms if (vm.cluster and vm.cluster.id == cluster.id)])
    cluster_row = [[
        cluster.name or "N/A",
        data_center_name,
        cpu_type,
        str(hosts_count),
        str(vm_count)
    ]]

    # --- 페이지네이션 변수 초기화 ---
    ln_selected = 0
    hosts_selected = 0
    vm_selected = 0

    # **추가**: 각 페이지 인덱스를 0으로 초기화
    ln_page = 0
    hosts_page = 0
    vm_page = 0

    # 항상 Logical Networks 탭에 포커스가 가도록 설정
    focus = 0  # 0: Logical Networks, 1: Hosts, 2: Virtual Machines

    # ── 페이지당 항목 수 설정 ──
    ln_page_size = 4
    hosts_page_size = 4

    # ── 메인 루프 ──
    while True:
        stdscr.erase()
        height, width = stdscr.getmaxyx()
        if height < 45 or width < 122:
            stdscr.addstr(0, 0, "Terminal too small. Resize to at least 122x45.")
            stdscr.refresh()
            stdscr.getch()
            continue

        current_row = 1

        # [1] Cluster 상세 정보(단일행) 출력
        title_cluster = f"- Cluster List for {cluster.name}"
        stdscr.addstr(current_row, 1, title_cluster)
        current_row += 1
        cluster_headers = ["Cluster Name", "Data Center", "CPU Type", "Hosts Count", "VM Count"]
        cluster_col_widths = [28, 26, 39, 11, 11]
        draw_simple_table(stdscr, current_row, cluster_headers, cluster_col_widths, cluster_row)
        current_row += draw_simple_table(stdscr, current_row, cluster_headers, cluster_col_widths, cluster_row) + 1

        # [2] Logical Networks 테이블 출력
        total_ln = len(cached_ln)
        total_ln_pages = max(1, math.ceil(total_ln / ln_page_size))
        if ln_selected >= total_ln:
            ln_selected = total_ln - 1 if total_ln > 0 else 0

        title_ln = f"- Logical Network for {cluster.name}"
        if total_ln_pages > 1:
            page_text = f"{ln_page+1}/{total_ln_pages}"
            gap = 121 - len(title_ln) - len(page_text)
            title_ln = title_ln + (" " * max(gap, 1)) + page_text
        stdscr.addstr(current_row, 1, title_ln)
        current_row += 1

        ln_headers = ["Name", "Status", "Description"]
        ln_col_widths = [28, 26, 63]
        start_ln = ln_page * ln_page_size
        end_ln = start_ln + ln_page_size
        page_lns = cached_ln[start_ln:end_ln]
        ln_sel_in_page = (ln_selected - start_ln
                          if (ln_selected >= start_ln and ln_selected < end_ln)
                          else None)

        # 화면에는 문자열로 출력하지만 내부에선 객체를 그대로 사용
        display_ln_rows = [
            [net.name or "-", (net.status.name if (net.status and hasattr(net.status, "name")) else "-"), net.comment or "-"]
            for net in page_lns
        ]

        draw_simple_table(
            stdscr,
            current_row,
            ln_headers,
            ln_col_widths,
            display_ln_rows,
            ln_sel_in_page,
            highlight=(focus == 0)
        )
        current_row += draw_simple_table(
            stdscr,
            current_row,
            ln_headers,
            ln_col_widths,
            display_ln_rows,
            ln_sel_in_page,
            highlight=(focus == 0)
        ) + 1

        # [3] Hosts for <Cluster Name> 테이블 출력
        total_hosts = len(cached_hosts)
        total_hosts_pages = max(1, math.ceil(total_hosts / hosts_page_size))
        if hosts_selected >= total_hosts:
            hosts_selected = total_hosts - 1 if total_hosts > 0 else 0

        title_hosts = f"- Host for {cluster.name}"
        if total_hosts_pages > 1:
            page_text = f"{hosts_page+1}/{total_hosts_pages}"
            gap = 121 - len(title_hosts) - len(page_text)
            title_hosts = title_hosts + (" " * max(gap, 1)) + page_text
        stdscr.addstr(current_row, 1, title_hosts)
        current_row += 1

        hosts_headers = ["Name", "IP Addresses", "Status", "Load"]
        hosts_col_widths = [28, 26, 39, 23]
        start_hosts = hosts_page * hosts_page_size
        end_hosts = start_hosts + hosts_page_size
        page_hosts = cached_hosts[start_hosts:end_hosts]
        hosts_sel_in_page = (hosts_selected - start_hosts
                             if (hosts_selected >= start_hosts and hosts_selected < end_hosts)
                             else None)

        draw_simple_table(
            stdscr,
            current_row,
            hosts_headers,
            hosts_col_widths,
            page_hosts,
            hosts_sel_in_page,
            highlight=(focus == 1)
        )
        current_row += draw_simple_table(
            stdscr,
            current_row,
            hosts_headers,
            hosts_col_widths,
            page_hosts,
            hosts_sel_in_page,
            highlight=(focus == 1)
        ) + 1

        # [4] Virtual Machines 테이블 출력
        total_vms = len(cached_cluster_vms)
        available_rows = max(41 - (current_row + 3), 1)
        total_vm_pages = max(1, math.ceil(total_vms / available_rows))
        if vm_selected >= total_vms:
            vm_selected = total_vms - 1 if total_vms > 0 else 0

        title_vm = f"- Virtual Machine for {cluster.name} (Total {total_vms} VMs)"
        if total_vm_pages > 1:
            page_text = f"{vm_page+1}/{total_vm_pages}"
            gap = 121 - len(title_vm) - len(page_text)
            title_vm = title_vm + (" " * max(gap, 1)) + page_text
        stdscr.addstr(current_row, 1, title_vm)
        current_row += 1

        vm_headers = ["Name", "Status", "Uptime", "CPU", "Memory", "Network", "IP Addresses"]
        vm_col_widths = [28, 13, 12, 10, 10, 24, 16]
        start_vm = vm_page * available_rows
        end_vm = start_vm + available_rows
        page_vms = cached_cluster_vms[start_vm:end_vm]
        vm_sel_in_page = (vm_selected - start_vm
                          if (vm_selected >= start_vm and vm_selected < end_vm)
                          else None)

        draw_simple_table(
            stdscr,
            current_row,
            vm_headers,
            vm_col_widths,
            page_vms,
            vm_sel_in_page,
            highlight=(focus == 2)
        )

        # 하단 상태줄
        right_status = "N=Next | P=Prev" if (total_ln_pages > 1 or total_hosts_pages > 1 or total_vm_pages > 1) else ""
        left_status = "TAB=Switch Focus | ▲/▼=Navigate | Enter=View Details | ESC=Go back | Q=Quit"
        draw_status_bar(stdscr, height - 1, left_status, right_status, total_width=121)

        stdscr.refresh()
        key = stdscr.getch()

        # ── 방향키/페이지 이동 처리 ──
        if key == -1:
            continue
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key == 27:  # ESC
            break
        elif key == 9:  # TAB: 포커스 전환
            if focus == 0 and total_hosts > 0:
                focus = 1
            elif focus == 1 and total_vms > 0:
                focus = 2
            else:
                focus = 0

        elif key == curses.KEY_UP:
            if focus == 0 and total_ln > 0:
                if ln_selected == 0:
                    ln_selected = total_ln - 1
                    ln_page = total_ln_pages - 1
                else:
                    ln_selected -= 1
                    if ln_selected < ln_page * ln_page_size:
                        ln_page -= 1
            elif focus == 1 and total_hosts > 0:
                if hosts_selected == 0:
                    hosts_selected = total_hosts - 1
                else:
                    hosts_selected -= 1
            elif focus == 2 and total_vms > 0:
                if vm_selected == 0:
                    vm_selected = total_vms - 1
                else:
                    vm_selected -= 1

        elif key == curses.KEY_DOWN:
            if focus == 0 and total_ln > 0:
                if ln_selected == total_ln - 1:
                    ln_selected = 0
                    ln_page = 0
                else:
                    ln_selected += 1
                    if ln_selected >= (ln_page + 1) * ln_page_size:
                        ln_page += 1
            elif focus == 1 and total_hosts > 0:
                if hosts_selected == total_hosts - 1:
                    hosts_selected = 0
                else:
                    hosts_selected += 1
            elif focus == 2 and total_vms > 0:
                if vm_selected == total_vms - 1:
                    vm_selected = 0
                else:
                    vm_selected += 1

        elif key in (ord('n'), ord('N')):
            if focus == 0 and ln_page < total_ln_pages - 1:
                ln_page += 1
                ln_selected = ln_page * ln_page_size
            elif focus == 1 and hosts_page < total_hosts_pages - 1:
                hosts_page += 1
                hosts_selected = hosts_page * hosts_page_size
            elif focus == 2 and vm_page < total_vm_pages - 1:
                vm_page += 1
                vm_selected = vm_page * available_rows

        elif key in (ord('p'), ord('P')):
            if focus == 0 and ln_page > 0:
                ln_page -= 1
                ln_selected = ln_page * ln_page_size
            elif focus == 1 and hosts_page > 0:
                hosts_page -= 1
                hosts_selected = hosts_page * hosts_page_size
            elif focus == 2 and vm_page > 0:
                vm_page -= 1
                vm_selected = vm_page * available_rows

        elif key in (10, 13):  # ENTER 키
            if focus == 0 and total_ln > 0:
                # **중요 변경**: 문자열이 아니라 실제 네트워크 객체를 넘겨 줌
                net_obj = cached_ln[ln_selected]
                run_subview(stdscr, show_network_detail_screen, connection, net_obj)
            elif focus == 1 and total_hosts > 0:
                selected_host_name = cached_hosts[hosts_selected][0]
                host_obj = next((h for h in all_hosts if h.name == selected_host_name), None)
                if host_obj:
                    show_host_detail_view(stdscr, connection, host_obj)
            elif focus == 2 and total_vms > 0:
                vm_obj = cached_cluster_vm_objects[vm_selected]
                show_vm_details(stdscr, connection, vm_obj)

    stdscr.clear()
    stdscr.refresh()

def show_network_detail_screen(stdscr, connection, net_obj):
    # net_obj가 리스트 형태인 경우 첫 번째 요소 사용
    if isinstance(net_obj, list):
        net_obj = net_obj[0]

    # -------------------------------
    # 헬퍼 함수: 제목 문자열 포맷
    def format_title(header_text, current_page, total_pages, total_width=121):
        page_info = f"{current_page}/{total_pages}"
        gap = total_width - len(header_text) - len(page_info)
        if gap < 1:
            gap = 1
        return header_text + (" " * gap) + page_info

    # -------------------------------
    # 필요한 서비스 불러오기
    system_service = connection.system_service()
    data_centers_service = system_service.data_centers_service()
    clusters_service = system_service.clusters_service()
    hosts_service = system_service.hosts_service()
    vms_service = system_service.vms_service()
    vnic_profiles_service = system_service.vnic_profiles_service()

    # -------------------------------
    # 데이터 딕셔너리 구성 (서비스 호출은 한번만)
    data_centers = {dc.id: dc.name for dc in data_centers_service.list()}
    clusters = {c.id: c.name for c in clusters_service.list()}
    hosts = {h.id: h.name for h in hosts_service.list()}
    vnic_profiles = {p.id: p for p in vnic_profiles_service.list()}

    # -------------------------------
    # 네트워크 기본 정보 구성
    dc_name = data_centers.get(net_obj.data_center.id, "-") if getattr(net_obj, "data_center", None) else "-"
    role = net_obj.usages[0] if hasattr(net_obj, "usages") and net_obj.usages else "-"
    vlan_tag = net_obj.vlan.id if getattr(net_obj, "vlan", None) else "-"
    mtu_val = net_obj.mtu if (hasattr(net_obj, "mtu") and net_obj.mtu and net_obj.mtu > 0) else 1500
    port_iso = getattr(net_obj, "port_isolation", False)

    # -------------------------------
    # 백그라운드 스레드로 데이터를 불러오기
    aggregated_vms = []
    vnic_list = []

    def load_vm_data():
        nonlocal aggregated_vms
        local_vms = []
        try:
            all_vms = vms_service.list()
            for vm in all_vms:
                try:
                    vm_service = vms_service.vm_service(vm.id)
                    nics = vm_service.nics_service().list()
                    for nic in nics:
                        if not nic.vnic_profile:
                            continue
                        profile_id = nic.vnic_profile.id
                        if profile_id not in vnic_profiles:
                            continue
                        profile = vnic_profiles[profile_id]
                        if not (profile.network and getattr(profile.network, "id", None)):
                            continue
                        if str(profile.network.id) == str(net_obj.id):
                            ip_addresses = []
                            try:
                                reported_devices = vm_service.reported_devices_service().list()
                                for device in reported_devices:
                                    if device.ips:
                                        for ip in device.ips:
                                            ip_addresses.append(ip.address)
                            except Exception:
                                pass
                            ip_str = ", ".join(ip_addresses) if ip_addresses else "-"
                            cluster_name = clusters.get(vm.cluster.id, "-") if vm.cluster else "-"
                            host_name = hosts.get(vm.host.id, "-") if (vm.status == types.VmStatus.UP and vm.host) else "-"
                            vnic_status = "Up" if vm.status == types.VmStatus.UP else "Down"
                            vnic_name = nic.name if nic.name else "-"
                            local_vms.append({
                                "vm_name": vm.name or "-",
                                "cluster": cluster_name,
                                "ip": ip_str,
                                "host_name": host_name,
                                "vnic_status": vnic_status,
                                "vnic": vnic_name,
                                "id": vm.id
                            })
                            break
                except Exception:
                    continue
        except Exception:
            pass
        if not local_vms:
            local_vms.append({
                "vm_name": "-",
                "cluster": "-",
                "ip": "-",
                "host_name": "-",
                "vnic_status": "-",
                "vnic": "-",
                "id": ""
            })
        aggregated_vms = local_vms

    def load_vnic_data():
        nonlocal vnic_list
        local_vnic = []
        try:
            for profile in vnic_profiles.values():
                if profile.network and getattr(profile.network, "id", None) == net_obj.id:
                    name = getattr(profile, "name", "-") or "-"
                    net_name = net_obj.name or "-"
                    dc = dc_name
                    nf = getattr(profile, "network_filter", None)
                    if nf is None:
                        net_filter = "vdsm-no-mac-spoofing"
                    elif isinstance(nf, str):
                        net_filter = nf
                    elif hasattr(nf, "name"):
                        net_filter = nf.name or "vdsm-no-mac-spoofing"
                    else:
                        net_filter = "vdsm-no-mac-spoofing"
                    port_mirroring = "True" if getattr(profile, "port_mirroring", False) else "False"
                    passthrough = "True" if "true" in str(getattr(profile, "passthrough", "")).strip().lower() else "False"
                    failover_obj = getattr(profile, "failover_vnic_profile", None)
                    failover = getattr(failover_obj, "name", "-") if failover_obj else "-"
                    local_vnic.append([name, net_name, dc, net_filter, port_mirroring, passthrough, failover])
        except Exception:
            pass
        vnic_list = local_vnic

    from threading import Thread
    t1 = Thread(target=load_vm_data)
    t2 = Thread(target=load_vnic_data)
    t1.start()
    t2.start()
    t1.join()
    t2.join()

    # -------------------------------
    # 최종 네트워크 정보 구성
    network_info = {
        "id": net_obj.id,
        "name": net_obj.name or "-",
        "data_center": dc_name,
        "description": net_obj.description or "-",
        "role": str(role),
        "vlan_tag": vlan_tag,
        "mtu": mtu_val,
        "port_isolation": str(port_iso),
        "vms": aggregated_vms
    }

    # -------------------------------
    # 포커스/페이지 관련 변수 설정
    # vNIC Profile 테이블: 한 페이지에 최대 4개 항목
    vnic_page = 1
    VNIC_PAGE_SIZE = 4
    # Virtual Machines 테이블: 사용 가능한 영역에 따라 동적으로 결정됨
    vm_page = 1
    vm_total = len(network_info["vms"])
    if vm_total == 1 and aggregated_vms[0]["vm_name"] == "-":
        vm_interactive = False
    else:
        vm_interactive = True

    vnic_total_pages = math.ceil(len(vnic_list) / VNIC_PAGE_SIZE) if len(vnic_list) > 0 else 1
    vnic_focus_enabled = (vnic_total_pages > 1)
    vm_focus_enabled = (vm_total > 0 and vm_interactive)

    if not vnic_focus_enabled and vm_focus_enabled:
        active_focus = "vm"
    else:
        active_focus = "vnic"

    vnic_selected = 0
    vm_selected = 0

    # -------------------------------
    # 화면 그리는 함수
    def draw_screen():
        stdscr.erase()
        height, width = stdscr.getmaxyx()

        # Network List 테이블 출력
        network_list_title = f"- Network List for {network_info['name']}"
        stdscr.addstr(1, 1, network_list_title)
        net_table_col_widths = [22, 23, 27, 6, 8, 13, 14]
        top_border = "┌" + "┬".join("─" * w for w in net_table_col_widths) + "┐"
        stdscr.addstr(2, 1, top_border)
        headers = ["Network Name", "Data Center", "Description", "Role", "VLAN Tag", "MTU", "Port Isolation"]
        header_row = "│" + "│".join(h.ljust(w) for h, w in zip(headers, net_table_col_widths)) + "│"
        stdscr.addstr(3, 1, header_row)
        divider = "├" + "┼".join("─" * w for w in net_table_col_widths) + "┤"
        stdscr.addstr(4, 1, divider)
        data_row = "│" + "│".join((str(network_info['name']).ljust(net_table_col_widths[0]),
                                   str(network_info['data_center']).ljust(net_table_col_widths[1]),
                                   str(network_info['description']).ljust(net_table_col_widths[2]),
                                   str(network_info['role']).ljust(net_table_col_widths[3]),
                                   str(network_info['vlan_tag']).ljust(net_table_col_widths[4]),
                                   (f"Default({network_info['mtu']})" if network_info['mtu'] == 1500 else str(network_info['mtu'])).ljust(net_table_col_widths[5]),
                                   str(network_info['port_isolation']).ljust(net_table_col_widths[6])
                                  )) + "│"
        stdscr.addstr(5, 1, data_row)
        bottom_border = "└" + "┴".join("─" * w for w in net_table_col_widths) + "┘"
        stdscr.addstr(6, 1, bottom_border)

        current_row = 8

        # vNIC Profile 테이블 출력
        vnic_title = f"- vNIC Profile for {network_info['name']}"
        if vnic_total_pages > 1:
            vnic_title = format_title(vnic_title, vnic_page, vnic_total_pages, total_width=121)
        stdscr.addstr(current_row, 1, vnic_title)
        current_row += 1

        vnic_headers = ["Name", "Netowrk", "Data Center", "Network Filter", "Port Mirroring", "Passthrough", "Failover vNIC Profile"]
        vnic_widths = [14, 13, 19, 21, 14, 11, 21]
        vnic_top = "┌" + "┬".join("─" * w for w in vnic_widths) + "┐"
        stdscr.addstr(current_row, 1, vnic_top)
        current_row += 1
        vnic_header = "│" + "│".join(get_display_width(h, w) for h, w in zip(vnic_headers, vnic_widths)) + "│"
        stdscr.addstr(current_row, 1, vnic_header)
        current_row += 1
        vnic_div = "├" + "┼".join("─" * w for w in vnic_widths) + "┤"
        stdscr.addstr(current_row, 1, vnic_div)
        current_row += 1

        start_vnic = (vnic_page - 1) * VNIC_PAGE_SIZE
        end_vnic = start_vnic + VNIC_PAGE_SIZE
        current_vnic = vnic_list[start_vnic:end_vnic]
        for idx, row in enumerate(current_vnic):
            row_str = "│" + "│".join(get_display_width(str(col), w) for col, w in zip(row, vnic_widths)) + "│"
            if vnic_focus_enabled and active_focus == "vnic" and idx == vnic_selected:
                stdscr.addstr(current_row, 1, row_str, curses.color_pair(1))
            else:
                stdscr.addstr(current_row, 1, row_str)
            current_row += 1
            
        # 데이터가 없으면 "-" 하나만 출력
        if not vnic_list:
            empty_row = "│" + "│".join(get_display_width("-", w) for w in vnic_widths) + "│"
            stdscr.addstr(current_row, 1, empty_row)
            current_row += 1
        else:
            start_vnic = (vnic_page - 1) * VNIC_PAGE_SIZE
            end_vnic = start_vnic + VNIC_PAGE_SIZE
            current_vnic = vnic_list[start_vnic:end_vnic]
            for idx, row in enumerate(current_vnic):
                # 각 컬럼을 순회하며, None이나 빈 문자열 대신 '-' 처리
                cells = [ensure_non_empty(col) for col in row]
                row_str = "│" + "│".join(get_display_width(str(col), w) for col, w in zip(cells, vnic_widths)) + "│"
                if vnic_focus_enabled and active_focus == "vnic" and idx == vnic_selected:
                    stdscr.addstr(current_row, 1, row_str, curses.color_pair(1))
                else:
                    stdscr.addstr(current_row, 1, row_str)
                current_row += 1  
            
        vnic_bottom = "└" + "┴".join("─" * w for w in vnic_widths) + "┘"
        stdscr.addstr(current_row, 1, vnic_bottom)
        current_row += 2

        # Virtual Machines 테이블 출력
        available_vm_area = 41 - current_row
        available_vm_data_rows = max(available_vm_area - 4, 1)
        if available_vm_data_rows > 0:
            current_vm_total_pages = math.ceil(vm_total / available_vm_data_rows)
        else:
            current_vm_total_pages = 1

        vm_title = f"- Virtual Machine for {network_info['name']} (Total {vm_total} VMs)"
        if current_vm_total_pages > 1:
            vm_title = format_title(vm_title, vm_page, current_vm_total_pages, total_width=121)
        stdscr.addstr(current_row, 1, vm_title)
        current_row += 1

        vm_headers = ["Virtual Machine Name", "Cluster", "IP Addresses", "Host Name", "vNIC Status", "vNIC"]
        vm_widths = [22, 23, 16, 21, 12, 20]
        vm_top = "┌" + "┬".join("─" * w for w in vm_widths) + "┐"
        stdscr.addstr(current_row, 1, vm_top)
        current_row += 1
        vm_header = "│" + "│".join(get_display_width(h, w) for h, w in zip(vm_headers, vm_widths)) + "│"
        stdscr.addstr(current_row, 1, vm_header)
        current_row += 1
        vm_div = "├" + "┼".join("─" * w for w in vm_widths) + "┤"
        stdscr.addstr(current_row, 1, vm_div)
        current_row += 1

        start_vm = (vm_page - 1) * available_vm_data_rows
        end_vm = start_vm + available_vm_data_rows
        current_vm = network_info["vms"][start_vm:end_vm]
        for idx, vm in enumerate(current_vm):
            row_values = [
                vm.get("vm_name", "-"),
                vm.get("cluster", "-"),
                vm.get("ip", "-"),
                vm.get("host_name", "-"),
                vm.get("vnic_status", "-"),
                vm.get("vnic", "-")
            ]
            row_str = "│" + "│".join(get_display_width(str(val), w) for val, w in zip(row_values, vm_widths)) + "│"
            if vm_focus_enabled and active_focus == "vm" and idx == vm_selected:
                stdscr.addstr(current_row, 1, row_str, curses.color_pair(1))
            else:
                stdscr.addstr(current_row, 1, row_str)
            current_row += 1
        vm_bottom = "└" + "┴".join("─" * w for w in vm_widths) + "┘"
        stdscr.addstr(current_row, 1, vm_bottom)

        # 하단 내비게이션 메시지 출력
        nav_left = "TAB=Switch Focus | ▲/▼=Navigate | ENTER=View Details | ESC=Go back | Q=Quit"
        nav_right = "N=Next | P=Prev" if (vnic_total_pages > 1 or current_vm_total_pages > 1) else ""
        total_width_nav = 121
        gap = total_width_nav - (len(nav_left) + len(nav_right))
        if gap < 1:
            gap = 1
        nav_line = nav_left + (" " * gap) + nav_right
        stdscr.addstr(height - 1, 1, nav_line)
        stdscr.refresh()
        return available_vm_data_rows, current_vm_total_pages

    # -------------------------------
    # 메인 입력 루프
    while True:
        available_vm_data_rows, current_vm_total_pages = draw_screen()
        key = stdscr.getch()
        if key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key == 27:
            break
        elif key == 9:  # TAB 키
            if vnic_focus_enabled and vm_focus_enabled:
                if active_focus == "vnic":
                    active_focus = "vm"
                    vm_selected = 0
                elif active_focus == "vm":
                    active_focus = "vnic"
                    vnic_selected = 0
        elif key == curses.KEY_UP:
            if active_focus == "vnic" and vnic_focus_enabled:
                if vnic_selected > 0:
                    vnic_selected -= 1
                else:
                    vnic_page = vnic_total_pages
                    last_page_items = len(vnic_list) - (vnic_total_pages - 1) * VNIC_PAGE_SIZE
                    vnic_selected = last_page_items - 1 if last_page_items > 0 else 0
            elif active_focus == "vm" and vm_focus_enabled:
                if vm_selected > 0:
                    vm_selected -= 1
                else:
                    vm_page = current_vm_total_pages
                    last_page_count = vm_total - (current_vm_total_pages - 1) * available_vm_data_rows
                    vm_selected = last_page_count - 1 if last_page_count > 0 else 0
        elif key == curses.KEY_DOWN:
            if active_focus == "vnic" and vnic_focus_enabled:
                current_items = vnic_list[(vnic_page - 1) * VNIC_PAGE_SIZE : vnic_page * VNIC_PAGE_SIZE]
                if vnic_selected < len(current_items) - 1:
                    vnic_selected += 1
                else:
                    if vnic_page < vnic_total_pages:
                        vnic_page += 1
                        vnic_selected = 0
                    else:
                        vnic_page = 1
                        vnic_selected = 0
            elif active_focus == "vm" and vm_focus_enabled:
                current_items = network_info["vms"][(vm_page - 1) * available_vm_data_rows : vm_page * available_vm_data_rows]
                if vm_selected < len(current_items) - 1:
                    vm_selected += 1
                else:
                    if vm_page < current_vm_total_pages:
                        vm_page += 1
                        vm_selected = 0
                    else:
                        vm_page = 1
                        vm_selected = 0
        elif key in (ord('n'), ord('N')):
            if active_focus == "vnic" and vnic_focus_enabled:
                if vnic_page < vnic_total_pages:
                    vnic_page += 1
                    vnic_selected = 0
            elif active_focus == "vm" and vm_focus_enabled:
                if vm_page < current_vm_total_pages:
                    vm_page += 1
                    vm_selected = 0
        elif key in (ord('p'), ord('P')):
            if active_focus == "vnic" and vnic_focus_enabled:
                if vnic_page > 1:
                    vnic_page -= 1
                    vnic_selected = 0
            elif active_focus == "vm" and vm_focus_enabled:
                if vm_page > 1:
                    vm_page -= 1
                    vm_selected = 0
        elif key in (10, ord('\n'), 13):
            if active_focus == "vnic" and vnic_focus_enabled:
                # vNIC Profile 상세보기가 있다면 호출 (미구현 시 pass)
                pass
            elif active_focus == "vm" and vm_focus_enabled:
                start_vm = (vm_page - 1) * available_vm_data_rows
                if start_vm + vm_selected < len(network_info["vms"]):
                    selected_vm_dict = network_info["vms"][start_vm + vm_selected]
                    vm_id = selected_vm_dict.get("id")
                    try:
                        vm_obj = connection.system_service().vms_service().vm_service(vm_id).get()
                        run_subview(stdscr, show_vm_details, connection, vm_obj)
                    except Exception as e:
                        stdscr.addstr(0, 0, f"Error fetching VM details: {e}")
                        stdscr.getch()

# =============================================================================
# Section 6: Cluster Section
# =============================================================================
def safe_addstr(win, y, x, text, attr=0):
    # 문자열을 추가할 때 curses 오류 발생 시 무시
    try:
        win.addstr(y, x, text, attr)
    except curses.error:
        pass

def draw_title_with_page(stdscr, y, title, current_page, total_pages, total_width=121):
    # 페이지 수가 1보다 많으면 페이지 정보 추가
    if total_pages > 1:
        page_text = f"{current_page+1}/{total_pages}"
        full_text = title.ljust(total_width - len(page_text)) + page_text
    else:
        full_text = title.ljust(total_width)
    # 제목 출력
    stdscr.addstr(y, 1, full_text[:total_width])

def draw_simple_table(stdscr, start_y, headers, col_widths, data, selected_index_in_page=None, highlight=False):
    # 강조 표시가 필요한 경우 기본 선택 인덱스를 0으로 설정
    if highlight and data and selected_index_in_page is None:
        selected_index_in_page = 0
    # 테이블 상단 테두리 출력
    top_border = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
    stdscr.addstr(start_y, 1, top_border)
    # 헤더 출력
    header_row = "│" + "│".join(get_display_width(str(h), w) for h, w in zip(headers, col_widths)) + "│"
    stdscr.addstr(start_y + 1, 1, header_row)
    # 헤더와 본문 구분선 출력
    divider = "├" + "┼".join("─" * w for w in col_widths) + "┤"
    stdscr.addstr(start_y + 2, 1, divider)
    
    row_y = start_y + 3

    if not data:
        # 데이터가 없으면 빈 줄 출력
        empty_row = "│" + "│".join(get_display_width("-", w) for w in col_widths) + "│"
        stdscr.addstr(row_y, 1, empty_row)
        row_y += 1
    else:
        # 데이터 출력
        for i, row in enumerate(data):
            row_line = "│" + "│".join(get_display_width(truncate_with_ellipsis(str(cell), w), w)
                                         for cell, w in zip(row, col_widths)) + "│"
            if highlight and i == selected_index_in_page:
                # 선택된 행은 강조 표시
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(row_y, 1, row_line)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(row_y, 1, row_line)
            row_y += 1

    # 테이블 하단 테두리 출력
    footer = "└" + "┴".join("─" * w for w in col_widths) + "┘"
    stdscr.addstr(row_y, 1, footer)
    # 테이블이 차지한 전체 높이 반환
    return row_y - start_y + 1

def show_clusters(stdscr, connection):
    # curses 색상 초기화
    init_curses_colors() 
    curses.curs_set(0)
    stdscr.timeout(5)
    
    try:
        clusters_service = connection.system_service().clusters_service()
        clusters = clusters_service.list()
        hosts_service = connection.system_service().hosts_service()
        hosts = hosts_service.list()
        vms_service = connection.system_service().vms_service()
        all_vms = vms_service.list()
    except Exception as e:
        safe_addstr(stdscr, 2, 1, f"Failed to fetch clusters: {e}", curses.color_pair(5))
        stdscr.refresh()
        stdscr.getch()
        return

    # ── Logical Network 캐시: 객체 리스트와 화면 표시용 문자열 리스트 두 가지를 각각 저장 ──
    ln_cache_objects = {}  # cluster_id → [Network object, ...]
    ln_cache_rows    = {}  # cluster_id → [[name, status, comment], ...]

    clusters_info = []
    for cluster in clusters:
        cluster_name = cluster.name or "N/A"
        data_center = "-"
        try:
            if cluster.data_center:
                dc_obj = connection.follow_link(cluster.data_center)
                data_center = dc_obj.name if (dc_obj and hasattr(dc_obj, "name")) else "N/A"
        except Exception:
            data_center = "N/A"

        cpu_type = "-"
        try:
            if cluster.cpu and hasattr(cluster.cpu, 'type'):
                cpu_type = cluster.cpu.type
            else:
                cpu_type = "N/A"
        except Exception:
            cpu_type = "N/A"

        hosts_count = sum(1 for h in hosts if h.cluster and h.cluster.id == cluster.id)
        vm_count    = sum(1 for vm in all_vms if vm.cluster and vm.cluster.id == cluster.id)
        clusters_info.append((cluster, [cluster_name, data_center, cpu_type, str(hosts_count), str(vm_count)]))

    # 클러스터별 VM/호스트 캐시 (변경 없음)
    cluster_vm_objects_cache = {}
    cluster_vm_display_cache = {}
    cluster_hosts_cache       = {}
    for cluster in clusters:
        cid = cluster.id
        cluster_vm_objects_cache[cid] = [vm for vm in all_vms if vm.cluster and vm.cluster.id == cid]
        cluster_vm_display_cache[cid] = [
            [
                vm.name or "N/A",
                (vm.status.value.lower() if (vm.status and hasattr(vm.status, 'value')) else "N/A"),
                (f"{(int(time.time()-vm.start_time.timestamp())//86400)}d "
                 f"{((int(time.time()-vm.start_time.timestamp())%86400)//3600)}h "
                 f"{(((int(time.time()-vm.start_time.timestamp())%3600)//60))}m")
                 if (vm.start_time and vm.status and vm.status.value.lower() == "up") else "-",
                (str(vm.cpu.topology.sockets * vm.cpu.topology.cores) if (vm.cpu and vm.cpu.topology) else "-"),
                (f"{int(vm.memory/(1024**2))} MB" if vm.memory else "-"),
                "-",  # Network placeholder
                "-"   # IP placeholder
            ]
            for vm in all_vms if vm.cluster and vm.cluster.id == cid
        ]

        cluster_hosts_cache[cid] = [
            [
                host.name or "N/A",
                (safe_gethostbyname(host.address) if (hasattr(host, "address") and host.address) else "-"),
                (host.status.value if (hasattr(host, "status") and host.status) else "-"),
                (f"{sum(1 for vm in all_vms if (vm.host and vm.host.id == host.id))} VMs")
            ]
            for host in hosts if host.cluster and host.cluster.id == cid
        ]

    # 화면 포커스, 페이징 변수 초기화
    focus          = 0
    cluster_page   = 0; ln_page     = 0; hosts_page   = 0; vm_page      = 0
    cluster_page_size = 4; ln_page_size = 4; hosts_page_size = 4
    cluster_selected = 0; ln_selected = 0; hosts_selected = 0; vm_selected = 0

    prev_cluster_id = None

    # ── oVirt SDK로 클러스터 네트워크 객체를 가져오는 함수 ──
    def get_networks_by_cluster_sdk(cluster_id):
        try:
            nets = connection.system_service() \
                             .clusters_service() \
                             .cluster_service(cluster_id) \
                             .networks_service() \
                             .list()
            return nets
        except Exception:
            return []

    while True:
        stdscr.erase()
        height, width = stdscr.getmaxyx()
        stdscr.addstr(1, 1, "■ Cluster", curses.A_BOLD)
        current_row = 3

        # [1] Cluster List 테이블
        total_clusters      = len(clusters_info)
        total_cluster_pages = max(1, math.ceil(total_clusters / cluster_page_size))
        if cluster_page >= total_cluster_pages:
            cluster_page = total_cluster_pages - 1
        if cluster_selected >= total_clusters:
            cluster_selected = total_clusters - 1

        draw_title_with_page(stdscr, current_row, "- Cluster List", cluster_page, total_cluster_pages)
        current_row += 1
        cluster_headers = ["Cluster Name", "Data Center", "CPU Type", "Hosts Count", "VM Count"]
        cluster_col_widths = [28, 26, 39, 11, 11]
        start_idx = cluster_page * cluster_page_size
        end_idx   = start_idx + cluster_page_size
        page_clusters = [item[1] for item in clusters_info[start_idx:end_idx]]
        cluster_sel_in_page = (cluster_selected - start_idx
                               if (cluster_selected >= start_idx and cluster_selected < end_idx)
                               else None)

        draw_simple_table(stdscr, current_row, cluster_headers, cluster_col_widths,
                          page_clusters, cluster_sel_in_page, focus == 0)
        current_row += draw_simple_table(stdscr, current_row, cluster_headers, cluster_col_widths,
                                         page_clusters, cluster_sel_in_page, focus == 0) + 1

        selected_cluster = (clusters_info[cluster_selected][0]
                            if total_clusters > 0 else None)

        # ── 클러스터가 바뀌었거나 캐시가 없으면 SDK로 네트워크 객체를 가져와 캐시 ──
        if selected_cluster and (prev_cluster_id is None or selected_cluster.id != prev_cluster_id):
            cid = selected_cluster.id
            if cid in ln_cache_objects:
                # 이미 캐시된 객체 리스트가 있으면 재사용
                ln_objs = ln_cache_objects[cid]
            else:
                ln_objs = get_networks_by_cluster_sdk(cid)  # 실제 oVirt SDK Network 객체 리스트
                ln_cache_objects[cid] = ln_objs

            # 화면 표시용 문자열 리스트 생성
            ln_cache_rows[cid] = [
                [
                    net.name or "-",
                    (net.status.name if (net.status and hasattr(net.status, "name")) else "-"),
                    net.comment or "-"
                ]
                for net in ln_objs
            ]

            prev_cluster_id = cid
            ln_selected     = 0
            hosts_selected  = 0
            vm_selected     = 0

        # [2] Logical Networks 테이블
        if selected_cluster:
            cid = selected_cluster.id
            cached_ln_rows = ln_cache_rows.get(cid, [])
        else:
            cached_ln_rows = []

        total_ln        = len(cached_ln_rows)
        total_ln_pages  = max(1, math.ceil(total_ln / ln_page_size))
        if ln_page >= total_ln_pages:
            ln_page = total_ln_pages - 1
        if ln_selected >= total_ln:
            ln_selected = total_ln - 1

        title_ln = (f"- Logical Network for {selected_cluster.name}"
                    if (selected_cluster and selected_cluster.name) else "- Logical Network")
        draw_title_with_page(stdscr, current_row, title_ln, ln_page, total_ln_pages)
        current_row += 1

        ln_headers    = ["Name", "Status", "Description"]
        ln_col_widths = [28, 26, 63]
        start_ln      = ln_page * ln_page_size
        end_ln        = start_ln + ln_page_size
        page_lns_rows = cached_ln_rows[start_ln:end_ln]
        ln_sel_in_page = (ln_selected - start_ln
                          if (ln_selected >= start_ln and ln_selected < end_ln)
                          else None)

        draw_simple_table(stdscr, current_row, ln_headers, ln_col_widths,
                          page_lns_rows, ln_sel_in_page, focus == 1)
        current_row += draw_simple_table(stdscr, current_row, ln_headers, ln_col_widths,
                                         page_lns_rows, ln_sel_in_page, focus == 1) + 1

        # [3] Hosts 테이블 (기존 코드 재사용)
        cid = selected_cluster.id if selected_cluster else None
        cached_hosts = cluster_hosts_cache.get(cid, []) if cid else []
        total_hosts        = len(cached_hosts)
        total_hosts_pages  = max(1, math.ceil(total_hosts / hosts_page_size))
        if hosts_page >= total_hosts_pages:
            hosts_page = total_hosts_pages - 1
        if hosts_selected >= total_hosts:
            hosts_selected = total_hosts - 1

        title_hosts = (f"- Host for {selected_cluster.name}"
                       if (selected_cluster and selected_cluster.name) else "- Host")
        draw_title_with_page(stdscr, current_row, title_hosts, hosts_page, total_hosts_pages)
        current_row += 1

        hosts_headers    = ["Name", "IP Addresses", "Status", "Load"]
        hosts_col_widths = [28, 26, 39, 23]
        start_hosts      = hosts_page * hosts_page_size
        end_hosts        = start_hosts + hosts_page_size
        page_hosts_rows  = cached_hosts[start_hosts:end_hosts]
        hosts_sel_in_page = (hosts_selected - start_hosts
                             if (hosts_selected >= start_hosts and hosts_selected < end_hosts)
                             else None)

        draw_simple_table(stdscr, current_row, hosts_headers, hosts_col_widths,
                          page_hosts_rows, hosts_sel_in_page, focus == 2)
        current_row += draw_simple_table(stdscr, current_row, hosts_headers, hosts_col_widths,
                                         page_hosts_rows, hosts_sel_in_page, focus == 2) + 1

        # [4] Virtual Machines 테이블 (기존 코드 재사용)
        cid = selected_cluster.id if selected_cluster else None
        cached_cluster_vms = cluster_vm_display_cache.get(cid, []) if cid else []
        total_vms         = len(cached_cluster_vms)
        available_rows    = max(41 - (current_row + 3), 1)
        total_vm_pages    = max(1, math.ceil(total_vms / available_rows))
        if vm_page >= total_vm_pages:
            vm_page = total_vm_pages - 1
        if vm_selected >= total_vms:
            vm_selected = total_vms - 1

        title_vm = (f"- Virtual Machine for {selected_cluster.name} (Total {total_vms} VM)"
                    if (selected_cluster and selected_cluster.name) else "- Virtual Machine")
        draw_title_with_page(stdscr, current_row, title_vm, vm_page, total_vm_pages)
        current_row += 1

        vm_headers    = ["Name", "Status", "Uptime", "CPU", "Memory", "Network", "IP Addresses"]
        vm_col_widths = [28, 13, 12, 10, 10, 24, 16]
        start_vm      = vm_page * available_rows
        end_vm        = start_vm + available_rows
        page_vms_rows = cached_cluster_vms[start_vm:end_vm]
        vm_sel_in_page = (vm_selected - start_vm
                          if (vm_selected >= start_vm and vm_selected < end_vm)
                          else None)

        draw_simple_table(stdscr, current_row, vm_headers, vm_col_widths,
                          page_vms_rows, vm_sel_in_page, focus == 3)

        # 하단 상태바
        if total_cluster_pages > 1 or total_ln_pages > 1 or total_hosts_pages > 1 or total_vm_pages > 1:
            right_status = "N=Next | P=Prev"
        else:
            right_status = ""
        left_status = "TAB=Switch Focus | ▲/▼=Navigate | Enter=View Events or Details | ESC=Go back | Q=Quit"
        draw_status_bar(stdscr, height - 1, left_status, right_status, total_width=121)

        stdscr.refresh()
        key = stdscr.getch()

        if key == -1:
            continue
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key == 27:
            break
        elif key == 9:  # TAB 키
            totals = [total_clusters, total_ln, total_hosts, total_vms]
            new_focus = (focus + 1) % 4
            count = 0
            while totals[new_focus] == 0 and count < 4:
                new_focus = (new_focus + 1) % 4
                count += 1
            focus = new_focus
            if focus == 1 and total_ln > 0:
                ln_selected = 0
            elif focus == 2 and total_hosts > 0:
                hosts_selected = 0
            elif focus == 3 and total_vms > 0:
                vm_selected = 0

        elif key == curses.KEY_UP:
            if focus == 0 and total_clusters > 0:
                if cluster_selected == 0:
                    cluster_selected = total_clusters - 1
                    cluster_page = total_cluster_pages - 1
                else:
                    cluster_selected -= 1
                    if cluster_selected < cluster_page * cluster_page_size:
                        cluster_page -= 1

            elif focus == 1 and total_ln > 0:
                if ln_selected == 0:
                    ln_selected = total_ln - 1
                    ln_page = total_ln_pages - 1
                else:
                    ln_selected -= 1
                    if ln_selected < ln_page * ln_page_size:
                        ln_page -= 1

            elif focus == 2 and total_hosts > 0:
                if hosts_selected == 0:
                    hosts_selected = total_hosts - 1
                    hosts_page = total_hosts_pages - 1
                else:
                    hosts_selected -= 1
                    if hosts_selected < hosts_page * hosts_page_size:
                        hosts_page -= 1

            elif focus == 3 and total_vms > 0:
                if vm_selected == 0:
                    vm_selected = total_vms - 1
                    vm_page = total_vm_pages - 1
                else:
                    vm_selected -= 1
                    if vm_selected < vm_page * available_rows:
                        vm_page -= 1

        elif key == curses.KEY_DOWN:
            if focus == 0 and total_clusters > 0:
                if cluster_selected == total_clusters - 1:
                    cluster_selected = 0
                    cluster_page = 0
                else:
                    cluster_selected += 1
                    if cluster_selected >= (cluster_page + 1) * cluster_page_size:
                        cluster_page += 1

            elif focus == 1 and total_ln > 0:
                if ln_selected == total_ln - 1:
                    ln_selected = 0
                    ln_page = 0
                else:
                    ln_selected += 1
                    if ln_selected >= (ln_page + 1) * ln_page_size:
                        ln_page += 1

            elif focus == 2 and total_hosts > 0:
                if hosts_selected == total_hosts - 1:
                    hosts_selected = 0
                    hosts_page = 0
                else:
                    hosts_selected += 1
                    if hosts_selected >= (hosts_page + 1) * hosts_page_size:
                        hosts_page += 1

            elif focus == 3 and total_vms > 0:
                if vm_selected == total_vms - 1:
                    vm_selected = 0
                    vm_page = 0
                else:
                    vm_selected += 1
                    if vm_selected >= (vm_page + 1) * available_rows:
                        vm_page += 1

        elif key in (ord('n'), ord('N')):
            if focus == 0 and cluster_page < total_cluster_pages - 1:
                cluster_page += 1
                cluster_selected = cluster_page * cluster_page_size

            elif focus == 1 and ln_page < total_ln_pages - 1:
                ln_page += 1
                ln_selected = ln_page * ln_page_size

            elif focus == 2 and hosts_page < total_hosts_pages - 1:
                hosts_page += 1
                hosts_selected = hosts_page * hosts_page_size

            elif focus == 3 and vm_page < total_vm_pages - 1:
                vm_page += 1
                vm_selected = vm_page * available_rows

        elif key in (ord('p'), ord('P')):
            if focus == 0 and cluster_page > 0:
                cluster_page -= 1
                cluster_selected = cluster_page * cluster_page_size

            elif focus == 1 and ln_page > 0:
                ln_page -= 1
                ln_selected = ln_page * ln_page_size

            elif focus == 2 and hosts_page > 0:
                hosts_page -= 1
                hosts_selected = hosts_page * hosts_page_size

            elif focus == 3 and vm_page > 0:
                vm_page -= 1
                vm_selected = vm_page * available_rows

        elif key in (10, 13):  # ENTER 키 처리
            if focus == 0 and selected_cluster:
                show_cluster_events(stdscr, connection, selected_cluster)

            elif focus == 1 and selected_cluster and total_ln > 0:
                cid = selected_cluster.id
                # 문자열이 아니라 SDK 객체를 꺼내서 전달
                net_obj = ln_cache_objects[cid][ln_selected]
                run_subview(stdscr, show_network_detail_screen, connection, net_obj)

            elif focus == 2 and hosts_selected < len(cached_hosts):
                host_name = cached_hosts[hosts_selected][0]
                host_obj = next((h for h in hosts if h.name == host_name), None)
                if host_obj:
                    show_host_detail_view(stdscr, connection, host_obj)

            elif focus == 3 and total_vms > 0:
                cid = selected_cluster.id
                vm_obj = cluster_vm_objects_cache[cid][vm_selected]
                show_vm_details(stdscr, connection, vm_obj)

        else:
            pass

    stdscr.clear()
    stdscr.refresh()

def show_cluster_events(stdscr, connection, cluster):
    """
    선택한 클러스터의 이벤트를 페이지 단위로 표시하며, 
    화살표 키로 커서를 이동하고 엔터 키를 누르면 
    해당 이벤트의 상세 정보를 팝업으로 보여줌
    - 각 셀 출력 시, 동아시아 문자는 2칸으로 계산하여 고정폭 문자열로 출력 (get_display_width 사용).
    - T키: 시간 순 정렬, W키: WARNING 우선 정렬, E키: ERROR 우선 정렬, R키: Refresh.
    - 같은 정렬키를 다시 누르면 오름차순/내림차순이 토글됨
    - 키 입력은 대소문자 구분 없이 처리함
    - 하단에 "T=Time | W=WARNING | E=ERROR | R=Refresh" 문구를 추가함
    """
    height, width = stdscr.getmaxyx()
    event_headers = ["Time", "Severity", "Description"]
    event_widths = [19, 9, 89]
    header_line = "┌" + "┬".join("─" * w for w in event_widths) + "┐"
    divider_line = "├" + "┼".join("─" * w for w in event_widths) + "┤"
    footer_line = "└" + "┴".join("─" * w for w in event_widths) + "┘"
    
    # 이벤트 로드를 스레드로 실행하고, 좌측 상단에 일반 글씨체로 스피너 표시
    events = []
    load_error = None

    def fetch_events():
        nonlocal events, load_error
        try:
            events_service = connection.system_service().events_service()
            all_events = events_service.list()
            events = [event for event in all_events
                      if hasattr(event, 'cluster') and event.cluster and event.cluster.id == cluster.id]
        except Exception as e:
            load_error = str(e)

    result_thread = threading.Thread(target=fetch_events)
    result_thread.daemon = True
    result_thread.start()

    spinner_chars = ['|', '/', '-', '\\']
    spinner_index = 0
    stdscr.nodelay(True)
    while result_thread.is_alive():
        stdscr.erase()
        # 좌측 상단(1행 1열)에 일반 글씨체로 출력
        stdscr.addstr(1, 1, f"Loading events... {spinner_chars[spinner_index]}")
        stdscr.refresh()
        spinner_index = (spinner_index + 1) % len(spinner_chars)
        time.sleep(0.1)
    stdscr.nodelay(False)

    if load_error:
        stdscr.erase()
        stdscr.addstr(2, 1, f"Failed to fetch events: {load_error}", curses.color_pair(5))
        stdscr.refresh()
        stdscr.getch()
        return

    # 정렬 및 페이징을 위한 변수 초기화
    page_size = 37  # 제목행 제외 37행
    selected_event_index = 0  # 전체 이벤트 목록에 대한 선택 인덱스
    
    # 정렬 상태 변수
    sort_mode = None   # "time", "warning", "error" 중 하나
    sort_ascending = True

    def draw_title_with_page(stdscr, y, title, current_page, total_pages, total_width=121):
        if total_pages > 1:
            page_text = f"{current_page+1}/{total_pages}"
            full_text = title.ljust(total_width - len(page_text)) + page_text
        else:
            full_text = title.ljust(total_width)
        stdscr.addstr(y, 1, full_text[:total_width])

    def show_event_detail_popup(stdscr, event):
        import textwrap
        height, width = stdscr.getmaxyx()
        BOX_WIDTH = 101  # 팝업창 너비
        BOX_HEIGHT = min(20, height - 4)
        popup_y = (height - BOX_HEIGHT) // 2
        popup_x = (width - BOX_WIDTH) // 2
        popup = curses.newwin(BOX_HEIGHT, BOX_WIDTH, popup_y, popup_x)
        popup.keypad(True)
        popup.border()
        title = "Event Detail"
        popup.addstr(1, (BOX_WIDTH - len(title)) // 2, title, curses.A_NORMAL)
        event_time = event.time.strftime('%Y-%m-%d %H:%M:%S') if event.time else "-"
        severity = getattr(event.severity, 'name', str(event.severity)) if event.severity else "-"
        description = event.description if event.description else "-"
        content_lines = []
        content_lines.append(f"Time: {event_time}")
        content_lines.append(f"Severity: {severity}")
        content_lines.append("Description:")
        wrapped = textwrap.wrap(description, BOX_WIDTH - 4)
        content_lines.extend(wrapped)
        start_line = 3
        for i, line in enumerate(content_lines):
            if start_line + i < BOX_HEIGHT - 2:
                popup.addstr(start_line + i, 2, line)
        footer = "Press any key to close"
        popup.addstr(BOX_HEIGHT - 2, (BOX_WIDTH - len(footer)) // 2, footer, curses.A_DIM)
        popup.refresh()
        popup.getch()
        popup.clear()
        stdscr.touchwin()
        stdscr.refresh()

    while True:
        stdscr.erase()
        
        # 정렬 적용 (정렬모드에 따라 events 리스트를 정렬)
        if sort_mode == "time":
            events.sort(key=lambda e: e.time if e.time is not None else datetime.min, reverse=not sort_ascending)
        elif sort_mode == "warning":
            events.sort(key=lambda e: ((0 if (hasattr(e.severity, "name") and e.severity.name.lower() == "warning") else 1),
                                        e.time if e.time is not None else datetime.min), reverse=not sort_ascending)
        elif sort_mode == "error":
            events.sort(key=lambda e: ((0 if (hasattr(e.severity, "name") and e.severity.name.lower() == "error") else 1),
                                        e.time if e.time is not None else datetime.min), reverse=not sort_ascending)
        
        # 선택 인덱스가 범위 내에 있도록 보정
        if events:
            selected_event_index = max(0, min(selected_event_index, len(events) - 1))
        else:
            selected_event_index = 0

        total_pages = max(1, (len(events) + page_size - 1) // page_size)
        current_page = selected_event_index // page_size
        page_start = current_page * page_size
        page_end = min(page_start + page_size, len(events))
        
        draw_title_with_page(stdscr, 1, f"- Events for {cluster.name}", current_page, total_pages, total_width=121)
        
        table_start_row = 2
        stdscr.addstr(table_start_row, 1, header_line)
        # 각 헤더 셀 출력 시 get_display_width 사용
        stdscr.addstr(table_start_row+1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(event_headers, event_widths)) + "│")
        stdscr.addstr(table_start_row+2, 1, divider_line)
        
        data_row = table_start_row + 3
        
        if page_end == page_start:
            row_str = "│" + "│".join(get_display_width("-", w) for w in event_widths) + "│"
            stdscr.addstr(data_row, 1, row_str)
            data_row += 1
        else:
            for idx in range(page_start, page_end):
                event = events[idx]
                time_str = event.time.strftime("%Y-%m-%d %H:%M:%S") if event.time else "-"
                severity_str = event.severity.name.lower() if hasattr(event.severity, "name") else "-"
                description = event.description if event.description else "-"
                row_cells = [time_str, severity_str, description]
                # 각 셀에 대해 get_display_width로 고정폭 문자열 생성
                row_str = "│" + "│".join(get_display_width(val, w) for val, w in zip(row_cells, event_widths)) + "│"
                if idx == selected_event_index:
                    stdscr.attron(curses.color_pair(1))
                    stdscr.addstr(data_row, 1, row_str)
                    stdscr.attroff(curses.color_pair(1))
                else:
                    stdscr.addstr(data_row, 1, row_str)
                data_row += 1
        
        stdscr.addstr(data_row, 1, footer_line)
        
        # 하단에 정렬/새로고침 관련 문구 추가 (상태바 바로 위)
        sort_key_info = "T=Time | W=WARNING | E=ERROR | R=Refresh"
        stdscr.addstr(height - 2, 1, sort_key_info.ljust(121))
        
        left_status = "ESC=Go Back | Q=Quit"
        right_status = "N=Next | P=Prev" if total_pages > 1 else ""
        draw_status_bar(stdscr, height - 1, left_status, right_status, total_width=121)
        
        stdscr.refresh()
        key = stdscr.getch()
        if key == curses.KEY_UP:
            # 위쪽 화살표: wrap-around 적용
            if selected_event_index > 0:
                selected_event_index -= 1
            else:
                selected_event_index = len(events) - 1
        elif key == curses.KEY_DOWN:
            # 아래쪽 화살표: wrap-around 적용
            if selected_event_index < len(events) - 1:
                selected_event_index += 1
            else:
                selected_event_index = 0
        elif key in (ord('n'), ord('N')):
            if current_page < total_pages - 1:
                selected_event_index = (current_page + 1) * page_size
        elif key in (ord('p'), ord('P')):
            if current_page > 0:
                selected_event_index = (current_page - 1) * page_size
        elif key in (10, ord('\n'), 13):  # 엔터 키
            if 0 <= selected_event_index < len(events):
                show_event_detail_popup(stdscr, events[selected_event_index])
        elif key == 27:  # ESC 키
            break
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        # 정렬 관련 키 (대소문자 구분 없이 처리)
        elif key in (ord('t'), ord('T')):
            if sort_mode == "time":
                sort_ascending = not sort_ascending
            else:
                sort_mode = "time"
                sort_ascending = True
        elif key in (ord('w'), ord('W')):
            if sort_mode == "warning":
                sort_ascending = not sort_ascending
            else:
                sort_mode = "warning"
                sort_ascending = True
        elif key in (ord('e'), ord('E')):
            if sort_mode == "error":
                sort_ascending = not sort_ascending
            else:
                sort_mode = "error"
                sort_ascending = True
        elif key in (ord('r'), ord('R')):
            # 다시 로드하기: 동일한 스레드 로딩 과정을 거침
            # 리프레시 시에도 로딩바 표시
            events.clear()
            load_error = None
            result_thread = threading.Thread(target=fetch_events)
            result_thread.daemon = True
            result_thread.start()

            spinner_index = 0
            stdscr.nodelay(True)
            while result_thread.is_alive():
                stdscr.erase()
                stdscr.addstr(1, 1, f"Loading events... {spinner_chars[spinner_index]}")
                stdscr.refresh()
                spinner_index = (spinner_index + 1) % len(spinner_chars)
                time.sleep(0.1)
            stdscr.nodelay(False)

            if load_error:
                stdscr.erase()
                stdscr.addstr(2, 1, f"Failed to fetch events: {load_error}", curses.color_pair(5))
                stdscr.refresh()
                stdscr.getch()
                return

        else:
            pass

    stdscr.clear()
    stdscr.refresh()

def show_host_events(stdscr, connection, host):
    """
    선택한 호스트의 이벤트를 페이지 단위로 표시 (제목행 제외 37행)
    """
    # 최소 터미널 크기 설정
    min_width = 120
    min_height = 14
    height, width = stdscr.getmaxyx()
    if height < min_height or width < min_width:
        stdscr.addstr(0, 0, f"Resize terminal to at least {min_width}x{min_height}.")
        stdscr.refresh()
        stdscr.getch()
        return

    # 테이블 헤더 설정
    event_headers = ["Time", "Severity", "Description"]
    event_widths = [19, 9, 89]
    header_line = "┌" + "┬".join("─" * w for w in event_widths) + "┐"
    divider_line = "├" + "┼".join("─" * w for w in event_widths) + "┤"
    footer_line = "└" + "┴".join("─" * w for w in event_widths) + "┘"

    # 이벤트 목록 조회
    try:
        events_service = connection.system_service().events_service()
        events = events_service.list(search=f"host.name={host.name}", max=50)
    except Exception as e:
        stdscr.addstr(2, 1, f"Failed to fetch events: {e}")
        stdscr.refresh()
        stdscr.getch()
        return

    # 페이징 설정
    page_size = 37  # 한 페이지에 보여줄 이벤트 수 (제목 제외)
    total_pages = max(1, (len(events) + page_size - 1) // page_size)
    current_page = 0
    total_width = 121

    # 메인 화면 루프
    while True:
        stdscr.erase()
        # 상단 헤더 출력 (왼쪽: 설명, 오른쪽: 페이지 정보)
        left_header = f"- Events for {host.name}"
        right_header = f"{current_page+1}/{total_pages}"
        header_str = left_header.ljust(total_width - len(right_header)) + right_header
        stdscr.addstr(1, 1, header_str)
        # 테이블 출력 시작 위치 설정
        table_start_row = 2
        stdscr.addstr(table_start_row, 1, header_line)
        stdscr.addstr(table_start_row + 1, 1, "│" + "│".join(f"{h:<{w}}" for h, w in zip(event_headers, event_widths)) + "│")
        stdscr.addstr(table_start_row + 2, 1, divider_line)
        # 현재 페이지의 이벤트 인덱스 계산
        start_idx = current_page * page_size
        end_idx = min(start_idx + page_size, len(events))
        data_row = table_start_row + 3
        # 이벤트 데이터 출력
        for event in events[start_idx:end_idx]:
            time_str = event.time.strftime("%Y-%m-%d %H:%M:%S") if event.time else "-"
            severity = event.severity.name.lower() if hasattr(event.severity, "name") else "-"
            description = event.description if event.description else "-"
            row_str = "│" + "│".join(
                f"{truncate_with_ellipsis(val, w):<{w}}" for val, w in zip([time_str, severity, description], event_widths)
            ) + "│"
            stdscr.addstr(data_row, 1, row_str)
            data_row += 1
        # 테이블 하단 출력
        stdscr.addstr(data_row, 1, footer_line)
        # 하단 상태 표시줄 출력
        left_status = "ESC=Go back | Q=Quit"
        right_status = "N=Next | P=Prev"
        status_line = left_status.ljust(total_width - len(right_status)) + right_status
        stdscr.addstr(height - 1, 1, status_line, curses.A_DIM)
        stdscr.refresh()
        # 키 입력 처리
        key = stdscr.getch()
        if key in (ord('n'), ord('N')) and current_page < total_pages - 1:
            # 다음 페이지로 이동
            current_page += 1
        elif key in (ord('p'), ord('P')) and current_page > 0:
            # 이전 페이지로 이동
            current_page -= 1
        elif key == 27:
            # ESC 입력 시 화면 나가기
            break
        elif key == ord('q'):
            # q 입력 시 프로그램 종료
            sys.exit(0)

# =============================================================================
# Section 7: Host Section
# =============================================================================
def center_cell(text, max_width):
    """
    text의 실제 출력 폭(동아시아 문자는 2칸 계산)이 max_width보다 크면
    get_display_width()를 통해 자른 후 반환하고, 그렇지 않으면 좌우에 공백을 추가하여 중앙 정렬한 문자열 반환
    """
    disp_width = sum(2 if unicodedata.east_asian_width(c) in ('F','W') else 1 for c in text)
    if disp_width > max_width:
        return get_display_width(text, max_width)
    extra = max_width - disp_width
    left_pad = extra // 2
    right_pad = extra - left_pad
    return " " * left_pad + text + " " * right_pad

# get_engine_status_symbol 함수
def get_engine_status_symbol(host, hosted_engine_host_id, hosted_engine_cluster_id):
    """
    호스트가 HostedEngine과 같은 경우 "▲",
    호스트의 클러스터가 HostedEngine 클러스터와 같으면 "▼",
    아니면 "-" 반환.
    """
    if hosted_engine_host_id and host.id == hosted_engine_host_id:
        return "▲"
    elif hosted_engine_cluster_id and host.cluster and host.cluster.id == hosted_engine_cluster_id:
        return "▼"
    else:
        return "-"

# 전역 NIC 속도 캐시 (5초 캐시)
NIC_SPEED_CACHE = {}

def get_cached_network_speed(interface):
    current_time = time.time()
    if interface in NIC_SPEED_CACHE:
        speed, last_update = NIC_SPEED_CACHE[interface]
        if current_time - last_update < 5:
            return speed
    # get_network_speed() 함수는 별도로 정의되어 있다고 가정
    speed = get_network_speed(interface)
    NIC_SPEED_CACHE[interface] = (speed, current_time)
    return speed

def show_hosts(stdscr, connection):
    init_curses_colors()  # 색상 초기화 (별도 정의됨)
    curses.curs_set(0)
    stdscr.timeout(100)  # 100ms 키 입력 대기

    try:
        hosts_service = connection.system_service().hosts_service()
        vms_service = connection.system_service().vms_service()
    except Exception as e:
        stdscr.addstr(2, 1, f"Failed to initialize services: {e}")
        stdscr.getch()
        return

    # --- 동시에 hosts와 VMs 조회 ---
    all_hosts = []
    all_vms = []
    def fetch_hosts():
        nonlocal all_hosts
        try:
            all_hosts = hosts_service.list()
        except Exception:
            all_hosts = []
    def fetch_vms():
        nonlocal all_vms
        try:
            all_vms = vms_service.list(follow="nics.reporteddevices")
        except Exception:
            all_vms = []
    t1 = Thread(target=fetch_hosts)
    t2 = Thread(target=fetch_vms)
    t1.start(); t2.start(); t1.join(); t2.join()
    if not all_hosts or not all_vms:
        stdscr.addstr(2, 1, "Failed to fetch host or VM data.")
        stdscr.getch()
        return

    # --- HostedEngine 정보 계산 ---
    hosted_engine_vm = next((vm for vm in all_vms if vm.name == "HostedEngine"), None)
    if hosted_engine_vm:
        hosted_engine_host_id = hosted_engine_vm.host.id if hosted_engine_vm.host else None
        hosted_engine_cluster_id = hosted_engine_vm.cluster.id if hosted_engine_vm.cluster else None
    else:
        hosted_engine_host_id = None
        hosted_engine_cluster_id = None

    # --- 모든 VM을 호스트별로 인덱싱 ---
    host_vms_dict = {}
    for vm in all_vms:
        if vm.host and hasattr(vm.host, "id"):
            host_vms_dict.setdefault(vm.host.id, []).append(vm)

    # --- Host List 테이블 행 생성 ---
    col_headers = ["Engine", "Name", "Cluster", "Status", "VMs", "Memory Usage", "CPU Usage", "IP"]
    col_widths = [7, 20, 20, 19, 6, 12, 13, 15]
    hosts_rows = []
    for host in all_hosts:
        cluster = "-"
        if hasattr(host, "cluster") and host.cluster:
            try:
                cluster_obj = connection.follow_link(host.cluster)
                cluster = cluster_obj.name if cluster_obj and getattr(cluster_obj, "name", None) else "-"
            except Exception:
                cluster = "-"
        engine = get_engine_status_symbol(host, hosted_engine_host_id, hosted_engine_cluster_id)
        name = host.name if host.name else "-"
        status = host.status.value if hasattr(host, "status") and host.status else "-"
        vm_count = len(host_vms_dict.get(host.id, []))
        try:
            host_service = hosts_service.host_service(host.id)
            statistics = host_service.statistics_service().list()
            cpu_util = next((s.values[0].datum for s in statistics if 'cpu.utilization' in s.name.lower()), None)
            if cpu_util is not None:
                try:
                    cpu_util = float(cpu_util)
                    if cpu_util <= 1:
                        cpu_util *= 100
                    cpu_usage_str = f"{round(cpu_util, 2)}%"
                except Exception:
                    cpu_usage_str = "N/A"
            else:
                cpu_idle = next((s.values[0].datum for s in statistics if "cpu.idle" in s.name.lower()), None)
                if cpu_idle is not None:
                    try:
                        cpu_idle = float(cpu_idle)
                        if cpu_idle <= 1:
                            cpu_idle *= 100
                        cpu_usage = 100 - cpu_idle
                        cpu_usage_str = f"{round(cpu_usage, 2)}%"
                    except Exception:
                        cpu_usage_str = "N/A"
                else:
                    cpu_load = next((s.values[0].datum for s in statistics if 'cpu.load.avg' in s.name.lower()), None)
                    if cpu_load is not None:
                        try:
                            cpu_load = float(cpu_load)
                            cpu_usage_str = f"{round(cpu_load, 2)}%"
                        except Exception:
                            cpu_usage_str = "N/A"
                    else:
                        cpu_usage_str = "N/A"
            memory_used = next((s.values[0].datum for s in statistics if 'memory.used' in s.name.lower()), None)
            memory_total = next((s.values[0].datum for s in statistics if 'memory.total' in s.name.lower()), None)
            if memory_used is not None and memory_total and memory_total > 0:
                mem_percent = f"{round((memory_used/memory_total)*100,1)}%"
            else:
                mem_percent = "N/A"
        except Exception:
            cpu_usage_str = "N/A"
            mem_percent = "N/A"
        ip = "-"
        if hasattr(host, "address") and host.address:
            ip = host.address
        if not ip or not ip.replace(".", "").isdigit():
            try:
                nics_temp = hosts_service.host_service(host.id).nics_service().list()
                for nic in nics_temp:
                    if hasattr(nic, "ip") and nic.ip and hasattr(nic.ip, "address"):
                        ip = nic.ip.address
                        break
            except Exception:
                pass
        hosts_rows.append([engine, name, cluster, status, str(vm_count), mem_percent, cpu_usage_str, ip])

    # --- UI 상태 변수 ---
    current_host_index = 0    # 선택된 호스트 인덱스
    vm_page = 0               # VM 테이블 페이지 인덱스
    nic_page = 0              # NIC 테이블 페이지 인덱스
    selected_nic_index = 0    # NIC 선택 인덱스
    selected_vm_index = 0     # VM 선택 인덱스
    focus = 0                 # 0: Hosts, 1: NIC, 2: VM
    hosts_page_size = 4
    nic_page_size = 4
    total_width = 121
    total_hosts_pages = (len(hosts_rows) + hosts_page_size - 1) // hosts_page_size

    # --- 백그라운드 통계 캐시 업데이트 (1초 주기) ---
    stats_cache = {}
    def refresh_stats():
        while True:
            for host in all_hosts:
                try:
                    stat_list = hosts_service.host_service(host.id).statistics_service().list()
                    stats_cache[host.id] = {'data': stat_list, 'timestamp': time.time()}
                except Exception:
                    stats_cache[host.id] = {'data': None, 'timestamp': time.time()}
            time.sleep(1)
    stats_thread = Thread(target=refresh_stats, daemon=True)
    stats_thread.start()

    # --- NIC 및 VM 캐시 ---
    last_selected_host_id = None
    cached_nics = []
    cached_vm_host_id = None
    vm_rows_cache = []
    cluster_cache = {}

    pad = curses.newpad(200, 200)

    # --- 메인 UI 루프 ---
    while True:
        height, width = stdscr.getmaxyx()
        if height < 40 or width < 121:
            stdscr.addstr(0, 0, "Resize terminal to at least 120x41.", curses.A_BOLD)
            stdscr.refresh()
            continue

        pad.erase()
        pad.addstr(1, 1, "■ Host", curses.A_BOLD)

        current_hosts_page = current_host_index // hosts_page_size
        hosts_header_left = f"- Host List (Total {len(hosts_rows)} Host)"
        if total_hosts_pages > 1:
            hosts_header_right = f"{current_hosts_page+1}/{total_hosts_pages}"
            hosts_header_line = hosts_header_left.ljust(total_width - len(hosts_header_right)) + hosts_header_right
        else:
            hosts_header_line = hosts_header_left
        pad.addstr(3, 1, hosts_header_line)
        table_y = 4
        header_line = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
        divider_line = "├" + "┼".join("─" * w for w in col_widths) + "┤"
        footer_line = "└" + "┴".join("─" * w for w in col_widths) + "┘"
        pad.addstr(table_y, 1, header_line)
        # 헤더 출력: Engine 열(인덱스 0)은 center_cell()를 사용하여 중앙 정렬
        header_cells = []
        for idx, (h, w) in enumerate(zip(col_headers, col_widths)):
            if idx == 0:
                header_cells.append(center_cell(h, w))
            else:
                header_cells.append(get_display_width(h, w))
        pad.addstr(table_y+1, 1, "│" + "│".join(header_cells) + "│")
        pad.addstr(table_y+2, 1, divider_line)
        start_idx = current_hosts_page * hosts_page_size
        end_idx = start_idx + hosts_page_size
        display_hosts = hosts_rows[start_idx:end_idx]
        for i, row in enumerate(display_hosts):
            y = table_y + 3 + i
            row_cells = []
            for idx, (val, w) in enumerate(zip(row, col_widths)):
                if idx == 0:
                    row_cells.append(center_cell(val, w))
                else:
                    row_cells.append(get_display_width(val, w))
            row_text = "│" + "│".join(row_cells) + "│"
            overall_index = start_idx + i
            if focus == 0 and overall_index == current_host_index:
                pad.attron(curses.color_pair(1))
                pad.addstr(y, 1, row_text)
                pad.attroff(curses.color_pair(1))
            else:
                pad.addstr(y, 1, row_text)
        pad.addstr(table_y + 3 + len(display_hosts), 1, footer_line)

        # --- 선택된 호스트 상세 정보 ---
        selected_host = all_hosts[current_host_index] if all_hosts else None
        details_y = table_y + 4 + len(display_hosts)
        uptime = "Loading..."
        mem_detail = "Loading..."
        cpu_detail = "Loading..."
        if selected_host:
            cache = stats_cache.get(selected_host.id, {})
            stat_list = cache.get('data')
            if stat_list:
                boot_time = None
                memory_total = None
                memory_used = None
                for stat in stat_list:
                    if stat.name.lower() == "boot.time":
                        try:
                            boot_time = datetime.fromtimestamp(int(stat.values[0].datum), timezone.utc)
                        except Exception:
                            boot_time = None
                    elif stat.name.lower() == "memory.total":
                        memory_total = int(stat.values[0].datum)
                    elif stat.name.lower() == "memory.used":
                        memory_used = int(stat.values[0].datum)
                if boot_time:
                    delta = datetime.now(timezone.utc) - boot_time
                    uptime = f"{delta.days}d {delta.seconds//3600}h {(delta.seconds//60)%60}m"
                if memory_total and memory_used:
                    mem_detail = f"{memory_used/(1024**3):.2f}GB / {memory_total/(1024**3):.2f}GB"
                host_vms = host_vms_dict.get(selected_host.id, [])
                assigned_vm_cpu = 0
                for vm in host_vms:
                    if hasattr(vm, "cpu") and vm.cpu and hasattr(vm.cpu, "topology") and vm.cpu.topology:
                        try:
                            assigned_vm_cpu += vm.cpu.topology.sockets * vm.cpu.topology.cores
                        except Exception:
                            pass
                host_total_cpu = None
                if (
                    hasattr(selected_host, "cpu")
                    and selected_host.cpu
                    and hasattr(selected_host.cpu, "topology")
                    and selected_host.cpu.topology
                ):
                    try:
                        topo = selected_host.cpu.topology
                        sockets = getattr(topo, "sockets", 0) or 0
                        cores   = getattr(topo, "cores",   0) or 0
                        # threads 속성이 없으면 1로 간주
                        threads = getattr(topo, "threads", 1) or 1
                        host_total_cpu = sockets * cores * threads
                    except Exception:
                        host_total_cpu = None
                if host_total_cpu and host_total_cpu > 0:
                    cpu_detail = f"{assigned_vm_cpu}/{host_total_cpu}"
                else:
                    cpu_detail = "N/A"
            else:
                uptime = mem_detail = cpu_detail = "Loading..."
        pad.addstr(details_y, 1, f"Uptime: {uptime}")
        pad.addstr(details_y+1, 1, f"Memory Usage: {mem_detail}")
        pad.addstr(details_y+2, 1, f"CPU Usage: {cpu_detail}")

        # --- NIC 테이블 ---
        net_y = details_y + 4
        nic_list = []
        if selected_host:
            if selected_host.id != last_selected_host_id:
                try:
                    cached_nics = hosts_service.host_service(selected_host.id).nics_service().list()
                except Exception:
                    cached_nics = []
                last_selected_host_id = selected_host.id
            nics_raw = cached_nics
            for nic in nics_raw:
                device = nic.name if hasattr(nic, "name") and nic.name else "-"
                network_name = "-"
                if hasattr(nic, "network") and nic.network:
                    try:
                        net_obj = connection.follow_link(nic.network)
                        network_name = net_obj.name if net_obj and getattr(net_obj, "name", None) else "-"
                    except Exception:
                        network_name = "-"
                elif hasattr(nic, "vnic_profile") and nic.vnic_profile:
                    try:
                        vp_obj = connection.follow_link(nic.vnic_profile)
                        network_name = vp_obj.name if vp_obj and getattr(vp_obj, "name", None) else "-"
                    except Exception:
                        network_name = "-"
                ip_addr = "-"
                if hasattr(nic, "ip") and nic.ip and hasattr(nic.ip, "address"):
                    ip_addr = nic.ip.address
                mac_addr = "-"
                if hasattr(nic, "mac") and nic.mac and hasattr(nic.mac, "address"):
                    mac_addr = nic.mac.address
                speed = get_cached_network_speed(nic.name if nic.name else "-")
                vlan = "-"
                if hasattr(nic, "vlan") and nic.vlan and hasattr(nic.vlan, "id"):
                    vlan = nic.vlan.id
                nic_list.append({
                    "devices": device,
                    "network_name": network_name,
                    "ip": ip_addr,
                    "mac_address": mac_addr,
                    "speed": speed,
                    "vlan": vlan
                })
        total_nic_pages = (len(nic_list) + nic_page_size - 1) // nic_page_size
        if total_nic_pages > 1:
            nics_header_right = f"{nic_page+1}/{total_nic_pages}"
            nics_header_line = f"- Network Interfaces for {selected_host.name}".ljust(total_width - len(nics_header_right)) + nics_header_right
        else:
            nics_header_line = f"- Network Interfaces for {selected_host.name}" if selected_host else "- Network Interfaces"
        pad.addstr(net_y, 1, nics_header_line)
        net_headers = ["Devices", "Network Name", "IP", "Mac Address", "Speed", "VLAN"]
        net_col_widths = [20, 20, 16, 26, 18, 14]
        net_header_line = "┌" + "┬".join("─" * w for w in net_col_widths) + "┐"
        net_divider_line = "├" + "┼".join("─" * w for w in net_col_widths) + "┤"
        net_footer_line = "└" + "┴".join("─" * w for w in net_col_widths) + "┘"
        pad.addstr(net_y+1, 1, net_header_line)
        pad.addstr(net_y+2, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(net_headers, net_col_widths)) + "│")
        pad.addstr(net_y+3, 1, net_divider_line)
        nic_start_idx = nic_page * nic_page_size
        nic_end_idx = nic_start_idx + nic_page_size
        display_nics = nic_list[nic_start_idx:nic_end_idx]
        row = net_y + 4
        if not display_nics:
            placeholder = ["-"] * len(net_headers)
            pad.addstr(row, 1, "│" + "│".join(get_display_width(str(val), w) for val, w in zip(nic_row, net_col_widths)) + "│")
            row += 1
        else:
            for i, item in enumerate(display_nics):
                overall_nic_index = nic_start_idx + i
                nic_row = [item["devices"], item["network_name"], item["ip"], item["mac_address"], item["speed"], item["vlan"]]
                if focus == 1 and overall_nic_index == selected_nic_index:
                    pad.attron(curses.color_pair(1))
                    pad.addstr(row, 1, "│" + "│".join(get_display_width(str(val), w) for val, w in zip(nic_row, net_col_widths)) + "│")
                    pad.attroff(curses.color_pair(1))
                else:
                    pad.addstr(row, 1, "│" + "│".join(get_display_width(str(val), w) for val, w in zip(nic_row, net_col_widths)) + "│")
                row += 1
        pad.addstr(row, 1, net_footer_line)

        # --- Virtual Machine 테이블 (캐싱된 VM 행 사용) ---
        vm_y = row + 2
        vm_col_widths = [20, 20, 16, 18, 8, 8, 10, 12]
        if selected_host and (cached_vm_host_id != selected_host.id):
            vm_rows_cache = []
            cluster_cache = {}
            for vm in host_vms_dict.get(selected_host.id, []):
                vm_cluster = "-"
                if hasattr(vm, "cluster") and vm.cluster:
                    cluster_id = vm.cluster.id
                    if cluster_id in cluster_cache:
                        vm_cluster = cluster_cache[cluster_id]
                    else:
                        try:
                            cluster_obj = connection.follow_link(vm.cluster)
                            vm_cluster = cluster_obj.name if cluster_obj and getattr(cluster_obj, "name", None) else "-"
                            cluster_cache[cluster_id] = vm_cluster
                        except Exception:
                            vm_cluster = "-"
                vm_name = vm.name if vm.name else "-"
                vm_ip = "N/A"
                if vm.nics:
                    for nic in vm.nics:
                        if nic.reported_devices:
                            for device in nic.reported_devices:
                                if device.ips:
                                    vm_ip = device.ips[0].address
                                    break
                        if vm_ip != "N/A":
                            break
                hostname = vm.name if vm.name else "-"
                memory_str = f"{int(vm.memory/(1024**3))} GB" if vm.memory else "-"
                cpu_str = "-"
                if vm.cpu and vm.cpu.topology:
                    cpu_count = vm.cpu.topology.sockets * vm.cpu.topology.cores
                    cpu_str = f"{cpu_count} Cores"
                vm_status = vm.status.value.lower() if vm.status and getattr(vm.status, "value", None) else "-"
                uptime_val = "-"
                if vm.start_time and vm_status == "up":
                    uptime_seconds = int(time.time() - vm.start_time.timestamp())
                    days = uptime_seconds // 86400
                    hours = (uptime_seconds % 86400) // 3600
                    minutes = (uptime_seconds % 3600) // 60
                    uptime_val = f"{days}d {hours}h {minutes}m"
                vm_row_data = [vm_name, vm_cluster, vm_ip, hostname, memory_str, cpu_str, vm_status, uptime_val]
                formatted_vm_row = "│" + "│".join(get_display_width(val, w) for val, w in zip(vm_row_data, vm_col_widths)) + "│"
                vm_rows_cache.append(formatted_vm_row)
            cached_vm_host_id = selected_host.id

        vm_table_y = vm_y + 1
        vm_header_line = "┌" + "┬".join("─" * w for w in vm_col_widths) + "┐"
        vm_divider_line = "├" + "┼".join("─" * w for w in vm_col_widths) + "┤"
        vm_footer_line = "└" + "┴".join("─" * w for w in vm_col_widths) + "┘"
        vms_header_left = f"- Virtual Machine for {selected_host.name} (Total {len(vm_rows_cache)} VM)" if selected_host else "- Virtual Machine"
        vm_page_size = max(1, 41 - (vm_table_y + 3))
        total_vm_pages = (len(vm_rows_cache) + vm_page_size - 1) // vm_page_size
        if total_vm_pages > 1:
            vms_header_right = f"{vm_page+1}/{total_vm_pages}"
            vms_header_line = vms_header_left.ljust(total_width - len(vms_header_right)) + vms_header_right
        else:
            vms_header_line = vms_header_left
        pad.addstr(vm_y, 1, vms_header_line)
        pad.addstr(vm_table_y, 1, vm_header_line)
        pad.addstr(vm_table_y+1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(["Name", "Cluster", "IP", "Hostname", "Memory", "CPU", "Status", "Uptime"], vm_col_widths)) + "│")
        pad.addstr(vm_table_y+2, 1, vm_divider_line)
        data_row = vm_table_y + 3
        vm_start_idx = vm_page * vm_page_size
        vm_end_idx = vm_start_idx + vm_page_size
        display_vm_rows = vm_rows_cache[vm_start_idx:vm_end_idx]
        if not display_vm_rows:
            empty_row = "│" + "│".join(get_display_width('-', w) for w in vm_col_widths) + "│"
            pad.addstr(data_row, 1, empty_row)
            data_row += 1
        else:
            for i, row_text in enumerate(display_vm_rows):
                overall_vm_index = vm_start_idx + i
                if focus == 2 and overall_vm_index == selected_vm_index:
                    pad.attron(curses.color_pair(1))
                    pad.addstr(data_row, 1, row_text)
                    pad.attroff(curses.color_pair(1))
                else:
                    pad.addstr(data_row, 1, row_text)
                data_row += 1
        pad.addstr(data_row, 1, vm_footer_line)

        # --- 하단 상태줄 ---
        left_status = "TAB=Switch Focus | ▲/▼=Navigate | ENTER=View Events or Details | ESC=Go back | Q=Quit"
        multi_page = (total_hosts_pages > 1 or total_nic_pages > 1 or total_vm_pages > 1)
        right_status = "N=Next | P=Prev" if multi_page else ""
        status_line = left_status.ljust(total_width - len(right_status)) + right_status if right_status else left_status
        pad.addstr(height - 1, 1, status_line, curses.A_NORMAL)

        pad.noutrefresh(0, 0, 0, 0, height - 1, width - 1)
        curses.doupdate()

        key = stdscr.getch()
        if key == -1:
            continue
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key == 27:
            break
        elif key == 9:
            focus = (focus + 1) % 3
            attempts = 0
            new_focus = focus
            while attempts < 3:
                if new_focus == 0 and len(hosts_rows) > 0:
                    break
#                elif new_focus == 1 and len(nic_list) > 0:
#                    break
                elif new_focus == 2 and len(vm_rows_cache) > 0:
                    break
                new_focus = (new_focus + 1) % 3
                attempts += 1
            focus = new_focus
            if focus == 1:
                selected_nic_index = nic_page * nic_page_size
            elif focus == 2:
                selected_vm_index = vm_page * vm_page_size
        else:
            if focus == 0:
                total_hosts = len(hosts_rows)
                if total_hosts == 0:
                    continue
                if key == curses.KEY_UP:
                    current_host_index = (current_host_index - 1) % total_hosts
                elif key == curses.KEY_DOWN:
                    current_host_index = (current_host_index + 1) % total_hosts
                elif key in (ord('n'), ord('N')):
                    current_hosts_page = current_host_index // hosts_page_size
                    if current_hosts_page < total_hosts_pages - 1:
                        current_host_index = (current_hosts_page + 1) * hosts_page_size
                elif key in (ord('p'), ord('P')):
                    current_hosts_page = current_host_index // hosts_page_size
                    if current_hosts_page > 0:
                        current_host_index = (current_hosts_page - 1) * hosts_page_size
                elif key == 10:
                    if selected_host:
                        show_host_events(stdscr, connection, selected_host)
            elif focus == 1:
                total_nic = len(nic_list)
                if total_nic == 0:
                    continue
                if key == curses.KEY_UP:
                    selected_nic_index = (selected_nic_index - 1) % total_nic
                    nic_page = selected_nic_index // nic_page_size
                elif key == curses.KEY_DOWN:
                    selected_nic_index = (selected_nic_index + 1) % total_nic
                    nic_page = selected_nic_index // nic_page_size
                elif key in (ord('n'), ord('N')):
                    if (nic_page + 1) < total_nic_pages:
                        nic_page += 1
                        selected_nic_index = nic_page * nic_page_size
                    else:
                        nic_page = 0
                        selected_nic_index = 0
                elif key in (ord('p'), ord('P')):
                    if nic_page > 0:
                        nic_page -= 1
                        selected_nic_index = nic_page * nic_page_size
                    else:
                        nic_page = total_nic_pages - 1
                        selected_nic_index = nic_page * nic_page_size
                        if selected_nic_index >= total_nic:
                            selected_nic_index = total_nic - 1
            elif focus == 2:
                total_vm = len(vm_rows_cache)
                if total_vm == 0:
                    continue
                if key == curses.KEY_UP:
                    selected_vm_index = (selected_vm_index - 1) % total_vm
                    vm_page = selected_vm_index // vm_page_size
                elif key == curses.KEY_DOWN:
                    selected_vm_index = (selected_vm_index + 1) % total_vm
                    vm_page = selected_vm_index // vm_page_size
                elif key in (ord('n'), ord('N')):
                    if (vm_page + 1) < total_vm_pages:
                        vm_page += 1
                        selected_vm_index = vm_page * vm_page_size
                    else:
                        vm_page = 0
                        selected_vm_index = 0
                elif key in (ord('p'), ord('P')):
                    if vm_page > 0:
                        vm_page -= 1
                        selected_vm_index = vm_page * vm_page_size
                    else:
                        vm_page = total_vm_pages - 1
                        selected_vm_index = vm_page * vm_page_size
                        if selected_vm_index >= total_vm:
                            selected_vm_index = total_vm - 1
                elif key == 10:
                    if 0 <= selected_vm_index < total_vm:
                        selected_vm = host_vms_dict.get(selected_host.id, [])[selected_vm_index]
                        show_vm_details(stdscr, connection, selected_vm)

# ---------------------------------------------------------------------------
# show_host_events 함수
# ---------------------------------------------------------------------------
def show_host_events(stdscr, connection, host):
    min_width = 120
    min_height = 14
    height, width = stdscr.getmaxyx()
    if height < min_height or width < min_width:
        stdscr.addstr(0, 0, f"Resize terminal to at least {min_width}x{min_height}.")
        stdscr.refresh()
        stdscr.getch()
        return

    event_headers = ["Time", "Severity", "Description"]
    event_widths = [19, 9, 89]
    header_line = "┌" + "┬".join("─" * w for w in event_widths) + "┐"
    divider_line = "├" + "┼".join("─" * w for w in event_widths) + "┤"
    footer_line = "└" + "┴".join("─" * w for w in event_widths) + "┘"

    try:
        events_service = connection.system_service().events_service()
        events = events_service.list(search=f"host.name={host.name}", max=50)
    except Exception as e:
        stdscr.addstr(2, 1, f"Failed to fetch events: {e}")
        stdscr.refresh()
        stdscr.getch()
        return

    if not events:
        stdscr.addstr(2, 1, "No events found for this host.")
        stdscr.refresh()
        stdscr.getch()
        return

    page_size = 37
    total_pages = max(1, (len(events) + page_size - 1) // page_size)
    selected_event_index = 0

    sort_mode = None
    sort_ascending = True

    def show_event_detail_popup(event):
        BOX_WIDTH = 101
        BOX_HEIGHT = min(20, height - 4)
        popup_y = (height - BOX_HEIGHT) // 2
        popup_x = (width - BOX_WIDTH) // 2
        popup = curses.newwin(BOX_HEIGHT, BOX_WIDTH, popup_y, popup_x)
        popup.keypad(True)
        popup.border()
        title = "Event Detail"
        popup.addstr(1, (BOX_WIDTH - len(title)) // 2, title, curses.A_NORMAL)
        event_time = event.time.strftime('%Y-%m-%d %H:%M:%S') if event.time else "-"
        severity = getattr(event.severity, 'name', str(event.severity)) if event.severity else "-"
        description = event.description if event.description else "-"
        content_lines = []
        content_lines.append(f"Time: {event_time}")
        content_lines.append(f"Severity: {severity}")
        content_lines.append("Description:")
        wrapped = textwrap.wrap(description, BOX_WIDTH - 4)
        content_lines.extend(wrapped)
        start_line = 3
        for i, line in enumerate(content_lines):
            if start_line + i < BOX_HEIGHT - 2:
                popup.addstr(start_line + i, 2, line)
        footer = "Press any key to close"
        popup.addstr(BOX_HEIGHT - 2, (BOX_WIDTH - len(footer)) // 2, footer, curses.A_DIM)
        popup.refresh()
        popup.getch()
        popup.clear()
        stdscr.touchwin()
        stdscr.refresh()

    while True:
        stdscr.erase()
        if sort_mode == "time":
            events.sort(key=lambda e: e.time if e.time is not None else datetime.min, reverse=not sort_ascending)
        elif sort_mode == "warning":
            events.sort(key=lambda e: (0 if (hasattr(e.severity, "name") and e.severity.name.lower() == "warning") else 1,
                                       e.time if e.time is not None else datetime.min), reverse=not sort_ascending)
        elif sort_mode == "error":
            events.sort(key=lambda e: (0 if (hasattr(e.severity, "name") and e.severity.name.lower() == "error") else 1,
                                       e.time if e.time is not None else datetime.min), reverse=not sort_ascending)

        if events:
            selected_event_index = max(0, min(selected_event_index, len(events) - 1))
        else:
            selected_event_index = 0

        total_pages = max(1, (len(events) + page_size - 1) // page_size)
        current_page = selected_event_index // page_size
        start_idx = current_page * page_size
        end_idx = min(start_idx + page_size, len(events))

        left_header = f"- Events for {host.name}"
        right_header = f"{current_page+1}/{total_pages}" if total_pages > 1 else ""
        header_str = left_header.ljust(121 - len(right_header)) + right_header if right_header else left_header.ljust(121)
        stdscr.addstr(1, 1, header_str)
        table_start_row = 2
        stdscr.addstr(table_start_row, 1, header_line)
        stdscr.addstr(table_start_row + 1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(event_headers, event_widths)) + "│")
        stdscr.addstr(table_start_row + 2, 1, divider_line)
        data_row = table_start_row + 3
        for idx in range(start_idx, end_idx):
            event = events[idx]
            time_str = event.time.strftime("%Y-%m-%d %H:%M:%S") if event.time else "-"
            severity_str = event.severity.name.lower() if hasattr(event.severity, "name") else "-"
            description = event.description if event.description else "-"
            row_str = "│" + "│".join(get_display_width(val, w) for val, w in zip([time_str, severity_str, description], event_widths)) + "│"
            if idx == selected_event_index:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(data_row, 1, row_str)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(data_row, 1, row_str)
            data_row += 1

        stdscr.addstr(data_row, 1, footer_line)
        sort_info = "T=Time | W=WARNING | E=ERROR | R=Refresh"
        stdscr.addstr(height - 2, 1, sort_info.ljust(121))
        left_status = "ESC=Go Back | Q=Quit"
        right_status = "N=Next | P=Prev" if total_pages > 1 else ""
        status_line = left_status.ljust(121 - len(right_status)) + right_status if right_status else left_status.ljust(121)
        stdscr.addstr(height - 1, 1, status_line, curses.A_DIM)
        stdscr.refresh()
        key = stdscr.getch()
        if key == curses.KEY_UP:
            selected_event_index = (selected_event_index - 1) % len(events)
        elif key == curses.KEY_DOWN:
            selected_event_index = (selected_event_index + 1) % len(events)
        elif key in (ord('n'), ord('N')):
            if current_page < total_pages - 1:
                selected_event_index = (current_page + 1) * page_size
        elif key in (ord('p'), ord('P')):
            if current_page > 0:
                selected_event_index = (current_page - 1) * page_size
        elif key in (10, 13):
            if 0 <= selected_event_index < len(events):
                show_event_detail_popup(events[selected_event_index])
        elif key == 27:
            break
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key in (ord('t'), ord('T')):
            if sort_mode == "time":
                sort_ascending = not sort_ascending
            else:
                sort_mode = "time"
                sort_ascending = True
        elif key in (ord('w'), ord('W')):
            if sort_mode == "warning":
                sort_ascending = not sort_ascending
            else:
                sort_mode = "warning"
                sort_ascending = True
        elif key in (ord('e'), ord('E')):
            if sort_mode == "error":
                sort_ascending = not sort_ascending
            else:
                sort_mode = "error"
                sort_ascending = True
        elif key in (ord('r'), ord('R')):
            try:
                events = events_service.list(search=f"host.name={host.name}", max=50)
            except Exception as e:
                stdscr.addstr(2, 1, f"Failed to refresh events: {e}")
                stdscr.refresh()
                stdscr.getch()

# =============================================================================
# Section 8: Network Section
# =============================================================================
def format_title(header_text, page_info, total_width=121):
    """
    header_text와 page_info를 받아, 두 문자열 사이에 필요한 공백을 삽입하여,
    전체 출력폭이 total_width(기본값 121)가 되도록 반환
    동아시아 문자의 폭(F, W)을 고려하여 문자열의 표시 길이를 계산함
    """
    # 동아시아 문자의 경우 폭이 2로 계산되도록 문자열의 길이를 측정하는 내부 함수
    def display_length(s):
        return sum(2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1 for c in s)

    # header_text와 page_info의 실제 출력 길이 계산
    disp_header = display_length(header_text)
    disp_page = display_length(page_info)
    # 두 문자열 사이에 들어갈 공백 길이를 전체 폭에서 두 문자열의 길이를 뺀 값으로 결정
    gap_length = total_width - (disp_header + disp_page)
    if gap_length < 1:
        gap_length = 1  # 공백 길이가 1 미만이면 최소 1 공백 삽입
    gap = " " * gap_length
    return header_text + gap + page_info

def get_display_width(text, max_width, align='left'):
    """
    동아시아 문자는 2칸으로 계산하여, 텍스트의 실제 출력 폭이 max_width를 초과하면
    마지막에 ".."를 붙여 자르고, 그렇지 않으면 지정된 정렬(좌측, 우측, 중앙)에 따라
    공백을 추가하여 고정 폭 문자열을 반환함.
    
    Parameters:
        text (str): 출력할 문자열.
        max_width (int): 셀의 최대 출력 폭.
        align (str): 정렬 방식. "left" (기본), "right", "center" 중 하나.
        
    Returns:
        str: 정렬된 문자열.
    """
    # 입력 문자열의 실제 출력 폭 계산 (동아시아 문자는 2칸)
    disp_width = sum(2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1 for c in text)
    
    if disp_width > max_width:
        truncated = ""
        current = 0
        # 출력 폭이 max_width보다 작아지도록 문자를 하나씩 추가
        for char in text:
            char_w = 2 if unicodedata.east_asian_width(char) in ('F', 'W') else 1
            if current + char_w > max_width - 2:
                break
            truncated += char
            current += char_w
        result = truncated + ".."
    else:
        result = text

    # 결과 문자열의 실제 출력 폭 다시 계산
    result_disp_width = sum(2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1 for c in result)
    padding = max_width - result_disp_width

    if align == 'left':
        return result + " " * padding
    elif align == 'right':
        return " " * padding + result
    elif align == 'center':
        left_pad = padding // 2
        right_pad = padding - left_pad
        return " " * left_pad + result + " " * right_pad
    else:
        # 잘못된 정렬 인자일 경우 좌측 정렬
        return result + " " * padding

# --- Event Page --- #
def show_event_page(stdscr, connection, network):
    """
    이벤트 페이지를 출력하는 함수
    - 제목행(헤더)에는 페이지 번호가 (Page X/Y) 형식으로 오른쪽 정렬되어 표시됨
    - 이벤트 테이블 헤더 아래 구분선은 각 열 경계에 "┴" 사용
    - 이벤트가 없을 경우, "No events found for this network." 메시지와 전체가 "─"로 표시된 하단 경계선 출력
    - 최대 37개 항목을 제목행을 제외하고 표시함
    """
    # 현재 터미널 창의 높이와 너비 가져오기
    height, width = stdscr.getmaxyx()
    # 이벤트 표시용 새로운 창 생성
    event_win = curses.newwin(height, width, 0, 0)
    event_win.clear()

    # 네트워크 정보에서 네트워크 이름, id, data center 추출
    network_name = network.get("name", "-")
    network_id = network.get("id", "-")
    network_data_center = network.get("data_center", "-")

    network_events = []
    MAX_EVENTS = 200  # 저장할 최대 이벤트 개수

    def fetch_events():
        """
        이벤트 목록을 가져와 필터링한 후, network_events 리스트에 추가
        중복 이벤트는 추가하지 않으며, 최대 MAX_EVENTS개까지만 저장
        """
        events_service = connection.system_service().events_service()
        new_events = events_service.list(max=100)
        filtered_events = [
            ev for ev in new_events
            if ev.description and ("network" in ev.description.lower())
            and (network_name in ev.description or network_id in ev.description)
            and (network_data_center in ev.description)
        ]
        # 기존 이벤트 ID들을 집합으로 저장
        existing_ids = {ev.id for ev in network_events}
        for event in filtered_events:
            if event.id not in existing_ids:
                network_events.append(event)
        # 이벤트 시간(time)을 기준으로 내림차순 정렬
        network_events.sort(key=lambda x: x.time, reverse=True)
        # 저장된 이벤트 수가 MAX_EVENTS를 초과하면 자름
        if len(network_events) > MAX_EVENTS:
            network_events[:] = network_events[:MAX_EVENTS]

    # 이벤트 페이지당 표시할 최대 항목 수 (제목행 제외)
    EVENT_PAGE_SIZE = 37
    current_page = 1

    def draw_event_page():
        """
        이벤트 페이지의 내용을 화면에 출력하는 함수
        - 제목행, 테이블 헤더, 이벤트 행, 하단 내비게이션 등을 그림
        """
        event_win.erase()
        total_events = len(network_events)
        # 총 페이지 수 계산 (최소 1페이지)
        max_page = max(1, math.ceil(total_events / EVENT_PAGE_SIZE))
        # 페이지 번호 정보 (여러 페이지인 경우에만)
        page_info = f"({current_page}/{max_page})" if max_page > 1 else ""
        title_base = f"- Event Page for {network_name} (Data Center: {network_data_center})"
        # 페이지 정보가 있으면 format_title 함수로 제목 라인을 구성
        title_line = format_title(title_base, page_info, total_width=121) if page_info else title_base
        event_win.addstr(1, 1, title_line)

        event_headers = ["Time", "Severity", "Description"]
        event_widths = [19, 9, 89]

        if total_events == 0:
            # 이벤트가 없을 경우: 테이블 상단, 헤더, 구분선, "No events found" 메시지, 하단 경계선을 그림
            header_line = "┌" + "─"*event_widths[0] + "┬" + "─"*event_widths[1] + "┬" + "─"*event_widths[2] + "┐"
            event_win.addstr(2, 1, header_line)
            event_win.addstr(3, 1, "│" + "│".join(get_display_width(event_headers[i], event_widths[i]) for i in range(len(event_headers))) + "│")
            divider_line = "├" + "─"*event_widths[0] + "┴" + "─"*event_widths[1] + "┴" + "─"*event_widths[2] + "┤"
            event_win.addstr(4, 1, divider_line)
            event_win.addstr(5, 1, "│" + " No events found for this network.".ljust(sum(event_widths)+2) + "│")
            footer_line = "└" + "─"*(sum(event_widths)+2) + "┘"
            event_win.addstr(6, 1, footer_line)
        else:
            header_line = "┌" + "┬".join("─"*w for w in event_widths) + "┐"
            event_win.addstr(2, 1, header_line)
            header_row = "│" + "│".join(get_display_width(h, w) for h, w in zip(event_headers, event_widths)) + "│"
            event_win.addstr(3, 1, header_row)
            divider_line = "├" + "┴".join("─"*w for w in event_widths) + "┤"
            event_win.addstr(4, 1, divider_line)

            # 현재 페이지에 해당하는 이벤트 인덱스 계산
            start_idx = (current_page - 1) * EVENT_PAGE_SIZE
            end_idx = min(start_idx + EVENT_PAGE_SIZE, total_events)
            for i, ev in enumerate(network_events[start_idx:end_idx]):
                time_str = ev.time.strftime("%Y-%m-%d %H:%M:%S") if ev.time else "-"
                severity = str(ev.severity).split(".")[-1]
                message = ev.description if ev.description else "-"
                row = [time_str, severity, message]
                row_str = "│" + "│".join(get_display_width(col, w) for col, w in zip(row, event_widths)) + "│"
                event_win.addstr(5+i, 1, row_str)
            bottom_line = "└" + "┴".join("─"*w for w in event_widths) + "┘"
            event_win.addstr(5 + (end_idx - start_idx), 1, bottom_line)

        # 하단 내비게이션 메시지 구성
        left_nav = "ESC=Go back | Q=Quit"
        right_nav = "N=Next | P=Prev" if max_page > 1 else ""
        total_width_nav = 121
        gap = total_width_nav - (len(left_nav) + len(right_nav))
        if gap < 1:
            gap = 1
        nav_line = left_nav + (" " * gap) + right_nav
        event_win.addstr(height-1, 1, nav_line)
        event_win.refresh()

    fetch_events()
    draw_event_page()

    while True:
        key = event_win.getch()
        if key == 27:  # ESC 키 입력 시 상위 메뉴로 복귀
            break
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key in (ord('n'), ord('N')) and current_page < math.ceil(len(network_events) / EVENT_PAGE_SIZE):
            current_page += 1
            draw_event_page()
        elif key in (ord('p'), ord('P')) and current_page > 1:
            current_page -= 1
            draw_event_page()
        else:
            fetch_events()
            draw_event_page()
            time.sleep(0.05)

# --- Main Screen: Network --- 
def draw_screen(stdscr, network_info, selected_network_idx, vm_page, vnic_page, MAX_VM_ROWS,
                vnic_profiles, active_focus, vm_selected_row, vnic_selected_row, hide_main_header=False):
    stdscr.erase()
    height, width = stdscr.getmaxyx()
    
    # 상단 헤더 출력 처리
    try:
        if not hide_main_header:
            stdscr.addstr(0, 1, " ")
            stdscr.addstr(1, 1, "■ Network", curses.A_BOLD)
            stdscr.addstr(2, 1, " ")
            table_top = 3  # 상단 3줄 사용
        else:
            stdscr.addstr(0, 1, " ")  # 공백 한 줄 출력
            table_top = 1      # 제목은 1번 줄에 출력되도록 설정
    except curses.error:
        table_top = 0

    # [1] Network List 영역
    NET_PAGE_SIZE = 4
    net_total = len(network_info)
    net_total_pages = math.ceil(net_total / NET_PAGE_SIZE) if net_total else 1
    net_current_page = (selected_network_idx // NET_PAGE_SIZE) + 1
    if net_total_pages > 1:
        net_title = format_title("- Network List", f"{net_current_page}/{net_total_pages}", total_width=121)
    else:
        net_title = "- Network List"
    try:
        stdscr.addstr(table_top, 1, net_title)
    except curses.error:
        pass

    net_table_start = table_top + 1
    net_headers = ["Network Name", "Data Center", "Description", "Role", "VLAN Tag", "MTU", "Port Isolation"]
    net_widths = [22, 23, 27, 6, 8, 13, 14]
    try:
        stdscr.addstr(net_table_start, 1, "┌" + "┬".join("─"*w for w in net_widths) + "┐")
        stdscr.addstr(net_table_start+1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(net_headers, net_widths)) + "│")
        stdscr.addstr(net_table_start+2, 1, "├" + "┼".join("─"*w for w in net_widths) + "┤")
    except curses.error:
        pass

    net_start_index = (net_current_page - 1) * NET_PAGE_SIZE
    net_end_index = net_start_index + NET_PAGE_SIZE
    visible_networks = network_info[net_start_index:net_end_index]
    for i, net in enumerate(visible_networks):
        overall_index = net_start_index + i
        row = [
            net.get("name", "-"),
            net.get("data_center", "-"),
            net.get("description", "-"),
            str(net.get("role", "-")).lower(),
            str(net.get("vlan_tag", "-")),
            "Default(1500)" if net.get("mtu", 1500) == 1500 else str(net.get("mtu", 1500)),
            str(net.get("port_isolation", "-")),
        ]
        try:
            color = curses.color_pair(1) if overall_index == selected_network_idx and active_focus=="networks" else 0
            stdscr.addstr(net_table_start+3+i, 1,
                          "│" + "│".join(get_display_width(d, w) for d, w in zip(row, net_widths)) + "│",
                          color)
        except curses.error:
            pass
    try:
        stdscr.addstr(net_table_start+3+len(visible_networks), 1, "└" + "┴".join("─"*w for w in net_widths) + "┘")
    except curses.error:
        pass

    # --- vNIC Profile 테이블 (한 페이지에 최대 4개 항목) ---
    VNIC_PAGE_SIZE = 4
    selected_network = network_info[selected_network_idx]
    vnic_title_base = f"- vNIC Profile for {selected_network.get('name', '-')}"
    vnic_list = []
    selected_net_id = selected_network.get("id", None)
    if selected_net_id:
        for profile in vnic_profiles.values():
            if profile.network and getattr(profile.network, "id", None) == selected_net_id:
                vnic_list.append(profile)
    vnic_total = len(vnic_list)
    vnic_total_pages = math.ceil(vnic_total / VNIC_PAGE_SIZE) if vnic_total else 1
    if vnic_total_pages > 1:
        vnic_title = format_title(vnic_title_base, f"{vnic_page}/{vnic_total_pages}", total_width=121)
    else:
        vnic_title = vnic_title_base
    try:
        stdscr.addstr(net_table_start+3+len(visible_networks)+1, 1, "")
        stdscr.addstr(net_table_start+3+len(visible_networks)+2, 1, vnic_title)
    except curses.error:
        pass

    vnic_table_start = net_table_start+3+len(visible_networks)+3
    vnic_headers = ["Name", "Netowrk", "Data Center", "Network Filter", "Port Mirroring", "Passthrough", "Failover vNIC Profile"]
    vnic_widths = [14, 13, 19, 21, 14, 11, 21]
    try:
        stdscr.addstr(vnic_table_start, 1, "┌" + "┬".join("─"*w for w in vnic_widths) + "┐")
        stdscr.addstr(vnic_table_start+1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(vnic_headers, vnic_widths)) + "│")
        stdscr.addstr(vnic_table_start+2, 1, "├" + "┼".join("─"*w for w in vnic_widths) + "┤")
    except curses.error:
        pass
    vnic_start_index = (vnic_page - 1) * VNIC_PAGE_SIZE
    vnic_visible = vnic_list[vnic_start_index:vnic_start_index+VNIC_PAGE_SIZE]
    
    # ── 데이터가 없을 때 최소 한 행을 그리기 위해 None 한 개를 추가
    if not vnic_visible:
        vnic_visible = [None]

    for i, profile in enumerate(vnic_visible):
        if profile is None:
            row = ["-"] * len(vnic_headers)
        else:
            name = getattr(profile, "name", "-") or "-"
            network_name = selected_network.get("name", "-")
            dc_name = selected_network.get("data_center", "-")
            if hasattr(profile, "data_center") and getattr(profile, "data_center"):
                dc_obj = getattr(profile, "data_center")
                if getattr(dc_obj, "name", None):
                    dc_name = dc_obj.name
            net_filter_obj = getattr(profile, "network_filter", None)
            if net_filter_obj is None:
                net_filter = "vdsm-no-mac-spoofing"
            elif isinstance(net_filter_obj, str):
                net_filter = net_filter_obj
            elif hasattr(net_filter_obj, "value"):
                net_filter = net_filter_obj.value
            elif hasattr(net_filter_obj, "name"):
                net_filter = (net_filter_obj.name or "vdsm-no-mac-spoofing").lower().replace("_", "-")
            else:
                net_filter = str(net_filter_obj)
            pt_value = getattr(profile, "passthrough", None)
            passthrough = "True" if "true" in str(pt_value).strip().lower() else "False"
            port_mirroring = "True" if getattr(profile, "port_mirroring", False) else "False"
            failover_obj = getattr(profile, "failover_vnic_profile", None)
            failover = getattr(failover_obj, "name", "-") if failover_obj else "-"
            row = [name, network_name, dc_name, net_filter, port_mirroring, passthrough, failover]
        try:
            if active_focus == "vnic" and i == vnic_selected_row:
                stdscr.addstr(vnic_table_start+3+i, 1,
                              "│" + "│".join(get_display_width(col, w) for col, w in zip(row, vnic_widths)) + "│",
                              curses.color_pair(1))
                stdscr.move(vnic_table_start+3+i, 1)
            else:
                stdscr.addstr(vnic_table_start+3+i, 1,
                              "│" + "│".join(get_display_width(col, w) for col, w in zip(row, vnic_widths)) + "│")
        except curses.error:
            pass
    try:
        stdscr.addstr(vnic_table_start+3+len(vnic_visible), 1, "└" + "┴".join("─"*w for w in vnic_widths) + "┘")
    except curses.error:
        pass

    # --- Virtual Machine 테이블 (한 페이지에 최대 15개 항목) ---
    VM_PAGE_SIZE = 15
    vm_list = selected_network.get("vms", [])
    vm_total = len(vm_list)
    vm_total_pages = math.ceil(vm_total / VM_PAGE_SIZE) if vm_total else 1
    title_base = f"- Virtual Machine for {selected_network.get('name', '-')} (Data Center: {selected_network.get('data_center', '-')})"
    if vm_total_pages > 1:
        vm_title = format_title(title_base, f"{vm_page}/{vm_total_pages}", total_width=121)
    else:
        vm_title = title_base
    try:
        stdscr.addstr(vnic_table_start+3+len(vnic_visible)+1, 1, "")
        stdscr.addstr(vnic_table_start+3+len(vnic_visible)+2, 1, vm_title)
    except curses.error:
        pass

    vm_table_start = vnic_table_start+3+len(vnic_visible)+3
    vm_headers = ["Virtual Machine Name", "Cluster", "IP Addresses", "Host Name", "vNIC Status", "vNIC"]
    vm_widths = [22, 23, 16, 21, 12, 20]
    try:
        stdscr.addstr(vm_table_start, 1, "┌" + "┬".join("─"*w for w in vm_widths) + "┐")
        stdscr.addstr(vm_table_start+1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(vm_headers, vm_widths)) + "│")
        stdscr.addstr(vm_table_start+2, 1, "├" + "┼".join("─"*w for w in vm_widths) + "┤")
    except curses.error:
        pass

    vm_start_index = (vm_page - 1) * VM_PAGE_SIZE
    vm_visible = vm_list[vm_start_index:vm_start_index+VM_PAGE_SIZE]
    if not vm_visible:
        vm_visible = [{"vm_name": "-", "cluster": "-", "ip": "-", "host_name": "-", "vnic_status": "-", "vnic": "-"}]
    vm_row_start = vm_table_start+3
    for idx, vm in enumerate(vm_visible):
        row = [
            vm.get("vm_name", "-"),
            vm.get("cluster", "-"),
            vm.get("ip", "-"),
            vm.get("host_name", "-"),
            vm.get("vnic_status", "-"),
            vm.get("vnic", "-")
        ]
        if active_focus == "vm" and idx == vm_selected_row:
            stdscr.addstr(vm_row_start+idx, 1,
                          "│" + "│".join(get_display_width(col, w) for col, w in zip(row, vm_widths)) + "│",
                          curses.color_pair(1))
            stdscr.move(vm_row_start+idx, 1)
        else:
            stdscr.addstr(vm_row_start+idx, 1,
                          "│" + "│".join(get_display_width(col, w) for col, w in zip(row, vm_widths)) + "│")
    try:
        stdscr.addstr(vm_row_start+len(vm_visible), 1, "└" + "┴".join("─"*w for w in vm_widths) + "┘")
    except curses.error:
        pass

    # --- 하단 내비게이션 메시지 출력 ---
    left_nav = "TAB=Switch Focus | ▲/▼=Navigate | ENTER=View Events or Details | ESC=Go back | Q=Quit"
    if net_total_pages > 1 or vnic_total_pages > 1 or vm_total_pages > 1:
        right_nav = "N=Next | P=Prev"
    else:
        right_nav = ""
    total_nav_width = 123
    gap = total_nav_width - (len(left_nav) + len(right_nav))
    if gap < 1:
        gap = 1
    nav_line = left_nav + (" " * gap) + right_nav
    try:
        stdscr.addstr(height-1, 1, nav_line)
    except curses.error:
        pass

    stdscr.noutrefresh()
 
def show_vnic_profile_details(stdscr, profile):
    """
    선택한 vNIC 프로파일의 상세 정보를 Field/Value 2열 테이블로 표시하고,
    ESC 또는 Q 키를 누를 때까지 대기함.
    """
    stdscr.clear()
    height, width = stdscr.getmaxyx()

    # 헤더 출력
    header = f"- vNIC Profile Details for {getattr(profile, 'name', '-') }"
    stdscr.addstr(1, 1, header)

    # 필드와 값 정의
    name = getattr(profile, "name", "-") or "-"
    profile_id = getattr(profile, "id", "-")
    vlan_tag = str(profile.vlan.id) if hasattr(profile, "vlan") and profile.vlan else "none"
    description = getattr(profile, "description", None) or "-"
    mtu = getattr(profile, "mtu", 1500)
    mtu_str = f"Default ({mtu})" if mtu == 1500 else str(mtu)
    vdsm_name = getattr(profile, "vdsm_name", None) or name
    network_id = getattr(getattr(profile, "network", None), "id", None) or "-"

    fields = [
        ("Name", name),
        ("Id", profile_id),
        ("VLAN Tag", vlan_tag),
        ("Description", description),
        ("ID", network_id),
        ("MTU", mtu_str),
        ("VDSM Name", vdsm_name)
    ]

    # 테이블 폭 및 컬럼 너비 계산
    desired_width = 121
    box_width = desired_width if width >= desired_width + 2 else width - 2
    col1 = 18
    col2 = box_width - 2 - col1 - 1
    start_row = 2

    # 테이블 그리기
    stdscr.addstr(start_row, 1, "┌" + "─" * col1 + "┬" + "─" * col2 + "┐")
    stdscr.addstr(start_row + 1, 1,
                  "│" + get_display_width("Field", col1) +
                  "│" + get_display_width("Value", col2) + "│")
    stdscr.addstr(start_row + 2, 1, "├" + "─" * col1 + "┼" + "─" * col2 + "┤")

    for i, (field, value) in enumerate(fields):
        stdscr.addstr(start_row + 3 + i, 1,
                      "│" + get_display_width(field, col1) +
                      "│" + get_display_width(value, col2) + "│")

    stdscr.addstr(start_row + 3 + len(fields), 1,
                  "└" + "─" * col1 + "┴" + "─" * col2 + "┘")

    # 내비게이션 안내
    nav = "ESC=Go back | Q=Quit"
    stdscr.addstr(height - 1, 1, nav)
    stdscr.refresh()

    # 키 입력 대기
    while True:
        key = stdscr.getch()
        if key in (27, ord('q'), ord('Q')):
            break

def run_subview(stdscr, subview_func, *args, **kwargs):
    """
    서브 뷰(하위 화면)를 실행하기 전 현재 터미널 상태를 저장하고,
    서브 뷰 종료 후 터미널 상태를 복원하여 부모 화면의 입력 모드에 문제가 없도록 함
    추가적으로 터미널 초기화 코드를 호출하여 환경을 보완함
    """
    curses.savetty()  # 현재 터미널 설정 저장
    try:
        subview_func(stdscr, *args, **kwargs)  # 서브 뷰 함수 실행
    finally:
        curses.resetty()
        stdscr.keypad(True)
        curses.noecho()
        curses.cbreak()
        curses.curs_set(0)
        curses.flushinp()
        curses.doupdate()

def show_networks(stdscr, connection, filter_network_name=None, show_header=True):
    # ── 컬러 페어 초기화 및 기본 터미널 모드 설정 ──
    curses.curs_set(0)        # 커서 감춤
    stdscr.keypad(True)       # 방향키, Function 키 입력 허용
    curses.start_color()      # 컬러 기능 활성화
    init_curses_colors()      # init_pair(1~5) 정의

    try:
        if show_header:
            stdscr.addstr(0, 1, " ")
            stdscr.addstr(1, 1, "■ Network", curses.A_BOLD)
            stdscr.addstr(2, 1, " ")
        else:
            for i in range(3):
                stdscr.addstr(i, 1, " " * 121)
    except curses.error:
        pass

    system_service = connection.system_service()
    networks_service = system_service.networks_service()
    vms_service = system_service.vms_service()
    clusters_service = system_service.clusters_service()
    data_centers_service = system_service.data_centers_service()
    hosts_service = system_service.hosts_service()
    vnic_profiles_service = system_service.vnic_profiles_service()

    clusters = {c.id: c.name for c in clusters_service.list()}
    data_centers = {dc.id: dc.name for dc in data_centers_service.list()}
    hosts = {h.id: h.name for h in hosts_service.list()}
    vnic_profiles = {p.id: p for p in vnic_profiles_service.list()}
    networks = networks_service.list()

    vm_mapping = {}
    all_vms = vms_service.list()
    for vm in all_vms:
        try:
            vm_service = vms_service.vm_service(vm.id)
            nics = vm_service.nics_service().list()
            for nic in nics:
                if not nic.vnic_profile:
                    continue
                vnic_profile_id = nic.vnic_profile.id
                if vnic_profile_id not in vnic_profiles:
                    continue
                vnic_profile = vnic_profiles[vnic_profile_id]
                if not (vnic_profile.network and getattr(vnic_profile.network, "id", None)):
                    continue
                net_id = vnic_profile.network.id
                try:
                    reported_devices = vm_service.reported_devices_service().list()
                    ip_addresses = []
                    for device in reported_devices:
                        if device.ips:
                            for ip in device.ips:
                                ip_addresses.append(ip.address)
                except Exception:
                    ip_addresses = []
                ip_address = ", ".join(ip_addresses) if ip_addresses else "-"
                cluster_name = clusters.get(vm.cluster.id, "-") if vm.cluster else "-"
                host_name = hosts.get(vm.host.id, "-") if (vm.status == types.VmStatus.UP and vm.host) else "-"
                vnic_status = "Up" if vm.status == types.VmStatus.UP else "Down"
                vnic_name = nic.name if nic.name else "-"
                if net_id not in vm_mapping:
                    vm_mapping[net_id] = {}
                if vm.id not in vm_mapping[net_id]:
                    vm_mapping[net_id][vm.id] = {
                        "vm_name": vm.name or "-",
                        "cluster": cluster_name,
                        "ip": ip_address,
                        "host_name": host_name,
                        "vnic_status": vnic_status,
                        "vnic": vnic_name,
                        "id": vm.id
                    }
                else:
                    existing = vm_mapping[net_id][vm.id]["vnic"]
                    if vnic_name not in existing.split(","):
                        vm_mapping[net_id][vm.id]["vnic"] = existing + "," + vnic_name
        except Exception:
            pass

    network_info = []
    for net in networks:
        dc_name = data_centers.get(net.data_center.id, "-") if net.data_center else "-"
        aggregated_vms = list(vm_mapping.get(net.id, {}).values())
        network_info.append({
            "id": net.id,
            "name": net.name or "-",
            "data_center": dc_name,
            "description": net.description or "-",
            "role": net.usages[0] if net.usages else "-",
            "vlan_tag": net.vlan.id if net.vlan else "-",
            "mtu": net.mtu if net.mtu and net.mtu > 0 else 1500,
            "port_isolation": getattr(net, "port_isolation", False),
            "vms": aggregated_vms
        })

    if filter_network_name:
        network_info = [net for net in network_info if net["name"] == filter_network_name]
        if not network_info:
            stdscr.addstr(3, 1, f"No network found for {filter_network_name}. Press any key to go back.")
            stdscr.getch()
            return

    selected_network_idx = 0
    vm_page = 1
    MAX_VM_ROWS = 15
    vnic_page = 1
    VNIC_PAGE_SIZE = 4
    active_focus = "networks"
    vm_selected_row = 0
    vnic_selected_row = 0

    while True:
        curses.flushinp()
        draw_screen(
            stdscr,
            network_info,
            selected_network_idx,
            vm_page,
            vnic_page,
            MAX_VM_ROWS,
            vnic_profiles,
            active_focus,
            vm_selected_row,
            vnic_selected_row,
            hide_main_header=not show_header
        )
        curses.doupdate()
        key = stdscr.getch()
        if key == 27:
            break
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        # 이하 입력 처리 (네비게이션, 포커스 전환 등)
        elif key == curses.KEY_UP:
            if active_focus == "networks":
                selected_network_idx = (selected_network_idx - 1) % len(network_info)
                vm_page = 1
            elif active_focus == "vnic":
                selected_network = network_info[selected_network_idx]
                vnic_list = [profile for profile in vnic_profiles.values()
                             if profile.network and getattr(profile.network, "id", None) == selected_network.get("id")]
                total_vnic = len(vnic_list)
                total_vnic_pages = math.ceil(total_vnic / VNIC_PAGE_SIZE) if total_vnic else 1
                if vnic_selected_row > 0:
                    vnic_selected_row -= 1
                else:
                    if vnic_page > 1:
                        vnic_page -= 1
                        vnic_visible = vnic_list[(vnic_page - 1) * VNIC_PAGE_SIZE : (vnic_page - 1) * VNIC_PAGE_SIZE + VNIC_PAGE_SIZE]
                        vnic_selected_row = len(vnic_visible) - 1
                    else:
                        vnic_page = total_vnic_pages
                        last_page_items = total_vnic - (total_vnic_pages - 1) * VNIC_PAGE_SIZE
                        vnic_selected_row = last_page_items - 1 if last_page_items > 0 else 0
            elif active_focus == "vm":
                current_vm_list = network_info[selected_network_idx].get("vms", [])
                vm_total = len(current_vm_list)
                vm_total_pages = max(1, math.ceil(vm_total / MAX_VM_ROWS))
                start_index = (vm_page - 1) * MAX_VM_ROWS
                current_rows = current_vm_list[start_index:start_index+MAX_VM_ROWS]
                if vm_selected_row > 0:
                    vm_selected_row -= 1
                else:
                    if vm_page > 1:
                        vm_page -= 1
                        new_start_index = (vm_page - 1) * MAX_VM_ROWS
                        new_rows = current_vm_list[new_start_index:new_start_index+MAX_VM_ROWS]
                        vm_selected_row = len(new_rows) - 1 if new_rows else 0
                    else:
                        vm_page = vm_total_pages
                        last_page_count = vm_total - (vm_total_pages - 1) * MAX_VM_ROWS
                        vm_selected_row = last_page_count - 1 if last_page_count > 0 else 0
        elif key == curses.KEY_DOWN:
            if active_focus == "networks":
                selected_network_idx = (selected_network_idx + 1) % len(network_info)
                vm_page = 1
            elif active_focus == "vnic":
                selected_network = network_info[selected_network_idx]
                vnic_list = [profile for profile in vnic_profiles.values()
                             if profile.network and getattr(profile.network, "id", None) == selected_network.get("id")]
                total_vnic = len(vnic_list)
                total_vnic_pages = math.ceil(total_vnic / VNIC_PAGE_SIZE) if total_vnic else 1
                vnic_visible = vnic_list[(vnic_page - 1) * VNIC_PAGE_SIZE : (vnic_page - 1) * VNIC_PAGE_SIZE + VNIC_PAGE_SIZE]
                if vnic_selected_row < len(vnic_visible) - 1:
                    vnic_selected_row += 1
                else:
                    if vnic_page < total_vnic_pages:
                        vnic_page += 1
                        vnic_selected_row = 0
                    else:
                        vnic_page = 1
                        vnic_selected_row = 0
            elif active_focus == "vm":
                current_vm_list = network_info[selected_network_idx].get("vms", [])
                vm_total = len(current_vm_list)
                vm_total_pages = max(1, math.ceil(vm_total / MAX_VM_ROWS))
                start_index = (vm_page - 1) * MAX_VM_ROWS
                current_rows = current_vm_list[start_index:start_index+MAX_VM_ROWS]
                if vm_selected_row < len(current_rows) - 1:
                    vm_selected_row += 1
                else:
                    if vm_page < vm_total_pages:
                        vm_page += 1
                        vm_selected_row = 0
                    else:
                        vm_page = 1
                        vm_selected_row = 0
        elif key == 9:
            curses.flushinp()
            if active_focus == "networks":
                active_focus = "vnic"
                vnic_selected_row = 0
            elif active_focus == "vnic":
                active_focus = "vm"
                vm_selected_row = 0
            elif active_focus == "vm":
                active_focus = "networks"
        elif key in (ord('n'), ord('N')):
            if active_focus == "vnic":
                selected_network = network_info[selected_network_idx]
                vnic_list = [profile for profile in vnic_profiles.values()
                             if profile.network and getattr(profile.network, "id", None) == selected_network.get("id")]
                total_vnic = len(vnic_list)
                total_vnic_pages = math.ceil(total_vnic / VNIC_PAGE_SIZE) if total_vnic else 1
                if vnic_page < total_vnic_pages:
                    vnic_page += 1
                    vnic_selected_row = 0
            elif active_focus == "vm":
                current_vm_list = network_info[selected_network_idx].get("vms", [])
                max_vm_page = max(1, math.ceil(len(current_vm_list) / MAX_VM_ROWS))
                if vm_page < max_vm_page:
                    vm_page += 1
                    vm_selected_row = 0
        elif key in (ord('p'), ord('P')):
            if active_focus == "vnic" and vnic_page > 1:
                vnic_page -= 1
                vnic_selected_row = 0
            elif active_focus == "vm" and vm_page > 1:
                vm_page -= 1
                vm_selected_row = 0
        elif key in (10, 13):
            if active_focus == "vnic":
                selected_network = network_info[selected_network_idx]
                vnic_list = [profile for profile in vnic_profiles.values()
                             if profile.network and getattr(profile.network, "id", None) == selected_network.get("id")]
                vnic_start_index = (vnic_page - 1) * VNIC_PAGE_SIZE
                if vnic_start_index + vnic_selected_row < len(vnic_list):
                    selected_profile = vnic_list[vnic_start_index + vnic_selected_row]
                    run_subview(stdscr, show_vnic_profile_details, selected_profile)
            elif active_focus == "vm":
                current_vm_list = network_info[selected_network_idx].get("vms", [])
                selected_index = (vm_page - 1) * MAX_VM_ROWS + vm_selected_row
                if selected_index < len(current_vm_list):
                    vm_id = current_vm_list[selected_index].get("id")
                    try:
                        vm_obj = connection.system_service().vms_service().vm_service(vm_id).get()
                        run_subview(stdscr, show_vm_details, connection, vm_obj)
                    except Exception as e:
                        stdscr.addstr(0, 0, f"Error fetching VM details: {str(e)}")
                        stdscr.getch()
            else:
                run_subview(stdscr, show_event_page, connection, network_info[selected_network_idx])
        else:
            pass

# =============================================================================
# Section 9: Storage Domain Section
# =============================================================================
def show_storage_domains(stdscr, connection):
    storage_info = fetch_storage_domains_data(connection)
    storage_domains = list(storage_info.keys())
    if not storage_domains:
        stdscr.clear()
        stdscr.addstr(0, 0, "No storage domains found. Press any key to go back.")
        stdscr.getch()
        return
    main_loop(stdscr, storage_domains, storage_info)

def show_events_storage_domain(stdscr, connection, domain_info):
    import threading, time, math, curses, unicodedata
    from datetime import datetime
    # domain_info에서 'name'과 'id'를 사용
    domain_name = domain_info.get('name', '-')
    domain_id = domain_info.get('id')
    result = {}

    def fetch():
        try:
            events_service = connection.system_service().events_service()
            all_events = events_service.list()
            events = [event for event in all_events
                      if hasattr(event, "storage_domain") and event.storage_domain and event.storage_domain.id == domain_id]
            result['events'] = events
        except Exception as e:
            result['error'] = str(e)
    # 초기 이벤트 가져오기 (스피너 표시)
    fetch_thread = threading.Thread(target=fetch)
    fetch_thread.start()
    spinner_chars = ['|', '/', '-', '\\']
    spinner_index = 0
    stdscr.nodelay(True)
    while fetch_thread.is_alive():
        stdscr.erase()
        stdscr.addstr(1, 1, f"Loading events... {spinner_chars[spinner_index]}")
        stdscr.refresh()
        spinner_index = (spinner_index + 1) % len(spinner_chars)
        time.sleep(0.1)
    fetch_thread.join()
    stdscr.nodelay(False)
    stdscr.keypad(True)
    if 'error' in result:
        stdscr.addstr(2, 1, f"Failed to fetch events: {result['error']}")
        stdscr.refresh()
        stdscr.getch()
        return
    events = result.get('events', [])
    total_events = len(events)
    rows_per_page = 37
    total_pages = math.ceil(total_events / rows_per_page) if total_events > 0 else 1
    selected_global = 0
    # 정렬 상태 변수: current_sort_key는 "T", "W", "E" 중 하나, sort_orders는 해당 키의 오름차순(True)/내림차순(False)
    current_sort_key = None
    sort_orders = {"T": True, "W": True, "E": True}
    while True:
        stdscr.erase()
        current_page = selected_global // rows_per_page
        local_index = selected_global % rows_per_page
        total_width = 121
        header_left = f"- Events for {domain_name}"
        header_right = f"{current_page+1}/{total_pages}"
        header_str = header_left.ljust(total_width - len(header_right)) + header_right
        stdscr.addstr(1, 1, header_str)
        # 테이블 헤더와 테두리 (열 폭: 시간 19, 심각도 9, 설명 89)
        event_headers = ["Time", "Severity", "Description"]
        event_widths = [19, 9, 89]
        header_line = "┌" + "┬".join("─" * w for w in event_widths) + "┐"
        divider_line = "├" + "┼".join("─" * w for w in event_widths) + "┤"
        footer_line = "└" + "┴".join("─" * w for w in event_widths) + "┘"
        stdscr.addstr(2, 1, header_line)
        header_row = "│" + "│".join(get_display_width(str(h), w) for h, w in zip(event_headers, event_widths)) + "│"
        stdscr.addstr(3, 1, header_row)
        stdscr.addstr(2, 1, header_line)
        stdscr.addstr(3, 1, header_row)
        if not events:
            # 이벤트가 하나도 없을 때에도 current_page_events를 빈 리스트로 정의
            current_page_events = []
            merged_div = (
                "├"
                + "─"*event_widths[0] + "┴"
                + "─"*event_widths[1] + "┴"
                + "─"*event_widths[2]
                + "┤"
            )
            stdscr.addstr(4, 1, merged_div)
            msg = " No events found for this storage domain."
            total_inner = sum(event_widths) + 2  # 19+9+89 + 2 = 119
            stdscr.addstr(5, 1, "│" + msg.ljust(total_inner) + "│")
            merged_footer = "└" + "─" * total_inner + "┘"
            stdscr.addstr(6, 1, merged_footer)
        else:
            stdscr.addstr(4, 1, divider_line)
            start_idx = current_page * rows_per_page
            end_idx = min(start_idx + rows_per_page, total_events)
            data_start = 5
            current_page_events = events[start_idx:end_idx]
            for idx, event in enumerate(current_page_events):
                time_str     = event.time.strftime("%Y-%m-%d %H:%M:%S") if event.time else "-"
                severity_str = (event.severity.name.lower() if hasattr(event.severity, "name") else "-")
                desc_str     = event.description or "-"
 
                row = (
                    "│"
                    + get_display_width(time_str,       event_widths[0]) + "│"
                    + get_display_width(severity_str,   event_widths[1]) + "│"
                    + get_display_width(desc_str,       event_widths[2]) + "│"
                )
                y = data_start + idx
                if idx == local_index:
                    stdscr.attron(curses.color_pair(1))
                    stdscr.addstr(y, 1, row)
                    stdscr.attroff(curses.color_pair(1))
                else:
                    stdscr.addstr(y, 1, row)
            # 바닥 테두리
            stdscr.addstr(data_start + len(current_page_events), 1, footer_line)
        # 하단 안내: 정렬/새로고침 관련 문구와 네비게이션 문구
        height, _ = stdscr.getmaxyx()
        instruction_line = "T=Time | W=WARNING | E=ERROR | R=Refresh"
        stdscr.addstr(height - 2, 1, instruction_line, curses.A_NORMAL)
        left_status = "ESC=Go Back | Q=Quit"
        right_status = "N=Next | P=Prev"
        status_line = left_status.ljust(total_width - len(right_status)) + right_status
        stdscr.addstr(height - 1, 1, status_line, curses.A_DIM)
        stdscr.refresh()
        key = stdscr.getch()
        if key in (curses.KEY_UP,):
            if selected_global > 0:
                selected_global -= 1
            else:
                selected_global = total_events - 1
        elif key in (curses.KEY_DOWN,):
            if selected_global < total_events - 1:
                selected_global += 1
            else:
                selected_global = 0
        elif key in (ord('n'), ord('N')):
            selected_global = (selected_global + rows_per_page) % total_events
        elif key in (ord('p'), ord('P')):
            selected_global = (selected_global - rows_per_page) % total_events
        elif key in (10, 13):  # Enter 키
            if current_page_events and 0 <= local_index < len(current_page_events):
                selected_event = current_page_events[local_index]
                show_event_detail_popup(stdscr, selected_event)
        # 정렬 기능 처리 (대소문자 구분 없이)
        elif key in (ord('t'), ord('T')):
            if current_sort_key == "T":
                sort_orders["T"] = not sort_orders["T"]
            else:
                current_sort_key = "T"
                sort_orders["T"] = True  # 기본 오름차순
            events.sort(key=lambda e: e.time if e.time else datetime.min, reverse=(not sort_orders["T"]))
            selected_global = 0
        elif key in (ord('w'), ord('W')):
            if current_sort_key == "W":
                sort_orders["W"] = not sort_orders["W"]
            else:
                current_sort_key = "W"
                sort_orders["W"] = True
            events.sort(key=lambda e: (0 if (hasattr(e.severity, "name") and e.severity.name.upper() == "WARNING") else 1,
                                       e.time if e.time else datetime.min),
                        reverse=(not sort_orders["W"]))
            selected_global = 0
        elif key in (ord('e'), ord('E')):
            if current_sort_key == "E":
                sort_orders["E"] = not sort_orders["E"]
            else:
                current_sort_key = "E"
                sort_orders["E"] = True
            events.sort(key=lambda e: (0 if (hasattr(e.severity, "name") and e.severity.name.upper() == "ERROR") else 1,
                                       e.time if e.time else datetime.min),
                        reverse=(not sort_orders["E"]))
            selected_global = 0
        elif key in (ord('r'), ord('R')):
            # Refresh: 정렬 상태 초기화 후 이벤트 새로 가져오기
            current_sort_key = None
            sort_orders = {"T": True, "W": True, "E": True}
            result = {}
            fetch_thread = threading.Thread(target=fetch)
            fetch_thread.start()
            spinner_chars = ['|', '/', '-', '\\']
            spinner_index = 0
            stdscr.nodelay(True)
            while fetch_thread.is_alive():
                stdscr.erase()
                stdscr.addstr(1, 1, f"Refreshing events... {spinner_chars[spinner_index]}")
                stdscr.refresh()
                spinner_index = (spinner_index + 1) % len(spinner_chars)
                time.sleep(0.1)
            fetch_thread.join()
            stdscr.nodelay(False)
            if 'error' in result:
                stdscr.addstr(2, 1, f"Failed to refresh events: {result['error']}")
                stdscr.refresh()
                stdscr.getch()
                break
            events = result.get('events', [])
            total_events = len(events)
            total_pages = math.ceil(total_events / rows_per_page) if total_events > 0 else 1
            selected_global = 0
        elif key == 27:  # ESC 키
            break
        elif key in (ord('q'), ord('Q')):
            import sys
            sys.exit(0)

def format_status_from_data_center(data_centers_service, domain, cached_data_centers):
    # 캐싱된 데이터 센터 목록을 활용하여 status 확인
    for dc in cached_data_centers:
        dc_service = data_centers_service.data_center_service(dc.id)
        storage_domains = dc_service.storage_domains_service().list()
        for storage_domain in storage_domains:
            if storage_domain.id == domain.id:
                if storage_domain.status == "unattached" or getattr(domain, "external_status", "") == "unattached":
                    return "-"
                return str(storage_domain.status).capitalize()
    if getattr(domain, "external_status", "") == "unattached" or getattr(domain, "master", True) is False:
        return "-"
    return "-"

def format_gb(size_in_bytes):
    return round(size_in_bytes / (1024 ** 3), 2) if size_in_bytes else "-"

def format_date(date_obj):
    if date_obj:
        return date_obj.strftime("%Y-%m-%d %H:%M:%S")
    return "-"

def fetch_storage_domains_data(connection):
    system_service = connection.system_service()
    storage_domains_service = system_service.storage_domains_service()
    data_centers_service = system_service.data_centers_service()

    # 데이터 센터 목록을 한 번만 호출하여 캐싱
    cached_data_centers = list(data_centers_service.list())
    data_centers = {dc.id: dc.name for dc in cached_data_centers}

    storage_domains = storage_domains_service.list()
    storage_info = {}
    for domain in storage_domains:
        data_center_name = "-"
        if hasattr(domain, "_data_centers") and domain._data_centers:
            first_dc = domain._data_centers[0]
            data_center_name = data_centers.get(first_dc.id, "-")
        
        # 캐싱된 data_centers를 사용하여 상태 포맷
        cross_status = format_status_from_data_center(data_centers_service, domain, cached_data_centers)
        available_space = getattr(domain, 'available', 0) or 0
        used_space = getattr(domain, 'used', 0) or 0
        total_space = available_space + used_space

        storage_info[domain.name] = {
            'name': domain.name,
            'id': domain.id,
            'type': domain.type,
            'storage_type': getattr(domain.storage, 'type', '-') if getattr(domain, 'storage', None) else '-',
            'cross_data_center_status': cross_status,
            'data_center': data_center_name,
            'total_space': format_gb(total_space),
            'free_space': format_gb(available_space),
            'properties': vars(domain),
            'disks': []
        }

    # 미리 storage domain ID → 이름 매핑 생성 (반복 순회 최적화)
    domain_id_to_name = {info['id']: name for name, info in storage_info.items()}

    disks_service = system_service.disks_service()
    vms_service = system_service.vms_service()
    disks = disks_service.list()
    vms = vms_service.list()

    disk_to_vms = {}
    vm_creation_dates = {}
    vm_templates = {}
    for vm in vms:
        vm_creation_dates[vm.id] = format_date(vm.creation_time) if hasattr(vm, 'creation_time') else "-"
        vm_templates[vm.id] = vm.original_template.name if getattr(vm, 'original_template', None) else "-"
        vm_service = vms_service.vm_service(vm.id)
        attachments = vm_service.disk_attachments_service().list()
        for attachment in attachments:
            disk_id = attachment.disk.id
            disk_to_vms.setdefault(disk_id, []).append(vm)

    for disk in disks:
        attached_vms = disk_to_vms.get(disk.id, [])
        vm_obj = attached_vms[0] if attached_vms else None
        for sd in disk.storage_domains:
            domain_name = domain_id_to_name.get(sd.id)
            if domain_name:
                storage_info[domain_name]['disks'].append({
                    'id': disk.id,
                    'vm_name': ', '.join(vm.name for vm in attached_vms if vm.name) if attached_vms else "-",
                    'vm_obj': vm_obj,
                    'disk_name': disk.name if disk.name else "-",
                    'disk_size_gb': format_gb(getattr(disk, 'provisioned_size', None)),
                    'actual_size_gb': format_gb(getattr(disk, 'actual_size', None)),
                    'creation_date': ', '.join(vm_creation_dates.get(vm.id, "-") for vm in attached_vms) if attached_vms else "-",
                    'template': ', '.join(vm_templates.get(vm.id) or "-" for vm in attached_vms) if attached_vms else "-",
                    'allocation_policy': "thick" if not disk.sparse else "Thin",
                    'status': str(disk.status) if disk.status else "-",
                    'type': str(getattr(disk, 'storage_type', '-')),
                    'alias': disk.alias if hasattr(disk, 'alias') and disk.alias else disk.name if disk.name else "-",
                    'description': disk.description if hasattr(disk, 'description') and disk.description else disk.name if disk.name else "-",
                    'disk_profile': str(disk.disk_profile) if hasattr(disk, 'disk_profile') and disk.disk_profile else "None",
                    'wipe_after_delete': str(disk.wipe_after_delete) if hasattr(disk, 'wipe_after_delete') else "False"
                })

    return storage_info

def draw_storage_domain_list(stdscr, storage_domains, sd_page, selected_idx, storage_info, start_y, active=False, header_text_override=None):
    sd_page_size = 4
    total_sd_pages = math.ceil(len(storage_domains) / sd_page_size) if storage_domains else 1
    page_info = f"{sd_page+1}/{total_sd_pages}" if total_sd_pages > 1 else ""
    
    if header_text_override:
        header_text = header_text_override
    else:
        header_text = "- Storage Domain List"
    gap = " " * (121 - len(header_text) - len(page_info))
    header_line_text = header_text + gap + page_info
    stdscr.addstr(start_y, 1, header_line_text)
    
    table_start = start_y + 1
    headers = ["Domain Name", "Domain Type", "Storage Type", "Cross Data Center Status", 
               "Total Space(GB)", "Free Space(GB)", "Data Center"]
    col_widths = [24, 12, 12, 24, 15, 14, 12]
    header_line = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
    divider_line = "├" + "┼".join("─" * w for w in col_widths) + "┤"
    footer_line = "└" + "┴".join("─" * w for w in col_widths) + "┘"
    
    stdscr.addstr(table_start, 1, header_line)
    stdscr.addstr(table_start+1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(headers, col_widths)) + "│")
    stdscr.addstr(table_start+2, 1, divider_line)
    
    start_index = sd_page * sd_page_size
    end_index = start_index + sd_page_size
    page_data = storage_domains[start_index:end_index]
    
    if not page_data:
        empty_row = "│" + "│".join(get_display_width("-", w) for w in col_widths) + "│"
        stdscr.addstr(table_start+3, 1, empty_row)
        num_rows = 1
    else:
        num_rows = len(page_data)
        selected_in_page = selected_idx - start_index
        for idx, domain in enumerate(page_data):
            info = storage_info.get(domain, {})
            row_data = [
                domain,
                str(info.get('type','-')),
                str(info.get('storage_type','-')),
                str(info.get('cross_data_center_status','-')),
                str(info.get('total_space','-')),
                str(info.get('free_space','-')),
                str(info.get('data_center','-'))
            ]
            row_text = "│" + "│".join(get_display_width(str(d), w) for d, w in zip(row_data, col_widths)) + "│"
            if active and idx == selected_in_page:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(table_start+3+idx, 1, row_text)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(table_start+3+idx, 1, row_text)
    stdscr.addstr(table_start+3+max(num_rows,1), 1, footer_line)
    return table_start+3+max(num_rows,1)+1

def draw_disk_table(stdscr, domain_name, domain_info, disk_selected, disk_page_size, start_y, active=False):
    disks = domain_info.get("disks", [])
    disks = [disk for disk in disks if disk.get("disk_name", "").strip().upper() != "OVF_STORE"]

    total_disks = len(disks)
    total_pages = max(1, (total_disks + disk_page_size - 1) // disk_page_size)
    current_page = disk_selected // disk_page_size if total_disks > 0 else 0

    header_text = f"- Disk for {domain_name} (Total {total_disks} Disk)"
    if total_pages > 1:
        page_info_str = f"{current_page+1}/{total_pages}"
        total_width = 121
        spaces_needed = total_width - len(header_text) - len(page_info_str)
        if spaces_needed < 1:
            spaces_needed = 1
        header_line_text = header_text + (" " * spaces_needed) + page_info_str
    else:
        header_line_text = header_text

    stdscr.addstr(start_y, 0, " " + header_line_text)
    y = start_y + 1

    detail_headers = ["Disk Name", "Virtual Size(GB)", "Actual Size(GB)", 
                      "Allocation Policy", "Storage Domain", "Status", "Type"]
    detail_widths = [32, 16, 15, 17, 17, 8, 8]
    header_line = "┌" + "┬".join("─" * w for w in detail_widths) + "┐"
    divider_line = "├" + "┼".join("─" * w for w in detail_widths) + "┤"
    footer_line = "└" + "┴".join("─" * w for w in detail_widths) + "┘"

    stdscr.addstr(y, 0, " " + header_line); y += 1
    header_row = "│" + "│".join(get_display_width(h, w) for h, w in zip(detail_headers, detail_widths)) + "│"
    stdscr.addstr(y, 0, " " + header_row); y += 1
    stdscr.addstr(y, 0, " " + divider_line); y += 1

    start_index = current_page * disk_page_size
    end_index = start_index + disk_page_size
    page_disks = disks[start_index:end_index]
    if page_disks:
        for disk in page_disks:
            row = [
                str(disk.get("disk_name", "-")),
                str(disk.get("disk_size_gb", "-")),
                str(disk.get("actual_size_gb", "-")),
                str(disk.get("allocation_policy", "-")),
                domain_name,
                str(disk.get("status", "-")),
                str(disk.get("type", "-"))
            ]
            row_cells = [get_display_width(cell, w) for cell, w in zip(row, detail_widths)]
            row_text = "│" + "│".join(row_cells) + "│"
            if active and (start_index + page_disks.index(disk)) == disk_selected:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(y, 0, " " + row_text)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(y, 0, " " + row_text)
            y += 1
    else:
        empty_row = "│" + "│".join(get_display_width("-", w) for w in detail_widths) + "│"
        stdscr.addstr(y, 0, " " + empty_row); y += 1

    stdscr.addstr(y, 0, " " + footer_line); y += 1
    return y

def draw_virtual_machines_table(stdscr, selected_domain, storage_info, vm_selected, start_y, vm_page_size, active=False, header_override=None):
    disks = storage_info[selected_domain]["disks"]
    total_disks = len(disks)
    total_vm_pages = max(1, math.ceil(total_disks / vm_page_size))
    current_vm_page = (vm_selected // vm_page_size) if total_disks > 0 else 0
    selected_in_page = vm_selected - (current_vm_page * vm_page_size) if total_disks > 0 else 0
    page_info = f"{current_vm_page+1}/{total_vm_pages}" if total_vm_pages > 1 else ""
    total_vms = total_disks

    if header_override is not None:
        header_line_text = header_override
    else:
        header_text = f"- Virtual Machine for {selected_domain} (Total {total_vms} VMs)"
        header_line_text = format_header(header_text, page_info, total_width=121)
    
    stdscr.addstr(start_y, 1, header_line_text)
    
    table_start = start_y + 1
    detail_headers = ["Virtual Machines", "Disk", "Size(GB)", "Actual Size(GB)", "Creation Date", "Template"]
    col_widths = [24, 37, 8, 15, 20, 10]
    header_line = "┌" + "┬".join("─" * w for w in col_widths) + "┐"
    divider_line = "├" + "┼".join("─" * w for w in col_widths) + "┤"
    footer_line = "└" + "┴".join("─" * w for w in col_widths) + "┘"
    
    stdscr.addstr(table_start, 1, header_line)
    stdscr.addstr(table_start+1, 1, "│" + "│".join(get_display_width(h, w) for h, w in zip(detail_headers, col_widths)) + "│")
    stdscr.addstr(table_start+2, 1, divider_line)
    
    start_index = current_vm_page * vm_page_size
    end_index = start_index + vm_page_size
    page_data = disks[start_index:end_index]
    row_y = table_start+3
    if page_data:
        for idx, disk in enumerate(page_data):
            row = [
                get_display_width(disk.get("vm_name", "-"), col_widths[0]),
                get_display_width(disk.get("disk_name", "-"), col_widths[1]),
                get_display_width(str(disk.get("disk_size_gb", "-")), col_widths[2]),
                get_display_width(str(disk.get("actual_size_gb", "-")), col_widths[3]),
                get_display_width(disk.get("creation_date", "-"), col_widths[4]),
                get_display_width(disk.get("template", "-"), col_widths[5])
            ]
            row_text = "│" + "│".join(row) + "│"
            if active and idx == selected_in_page:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(row_y, 1, row_text)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(row_y, 1, row_text)
            row_y += 1
    else:
        empty_row = "│" + "│".join(get_display_width("-", w) for w in col_widths) + "│"
        stdscr.addstr(row_y, 1, empty_row)
        row_y += 1
    stdscr.addstr(row_y, 1, footer_line)
    return row_y+1

def format_header(header_text, page_info, total_width=123):
    def display_length(s):
        return sum(2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1 for c in s)
    
    disp_header = display_length(header_text)
    disp_page = display_length(page_info)
    gap_length = total_width - (disp_header + disp_page)
    if gap_length < 1:
        gap_length = 1
    gap = " " * gap_length
    return header_text + gap + page_info

def show_disk_detail_screen(stdscr, disk, domain_name):
    import textwrap
    stdscr.clear()
    height, width = stdscr.getmaxyx()
    left_width = 18
    right_width = 100

    # 헤더
    header_title = f"- Disk Details for {disk.get('disk_name', '-')}"
    stdscr.addstr(1, 1, header_title)

    # 테두리
    top_border = "┌" + "─" * left_width + "┬" + "─" * right_width + "┐"
    stdscr.addstr(2, 1, top_border)

    # 헤더 행: Field / Value
    header_row = (
        "│"
        + get_display_width("Field", left_width)
        + "│"
        + get_display_width("Value", right_width)
        + "│"
    )
    stdscr.addstr(3, 1, header_row)

    # 구분선
    divider = "├" + "─" * left_width + "┼" + "─" * right_width + "┤"
    stdscr.addstr(4, 1, divider)

    # 실제 내용
    details = {
        "Name": disk.get("disk_name", "-"),
        "Size (GB)": disk.get("disk_size_gb", "-"),
        "Storage Domain": domain_name,
        "VM Name": disk.get("vm_name", "N/A"),
        "Content Type": disk.get("type", "-"),
        "ID": disk.get("id", "-"),
        "Alias": disk.get("alias", "-"),
        "Description": disk.get("description", "-"),
        "Disk Profile": disk.get("disk_profile", "None"),
        "Wipe After Delete": disk.get("wipe_after_delete", "False"),
        "Virtual Size (GB)": disk.get("disk_size_gb", "-"),
        "Actual Size (GB)": disk.get("actual_size_gb", "-"),
        "Allocation Policy": disk.get("allocation_policy", "-")
    }

    row = 5
    for field, value in details.items():
        # 첫 줄
        first_line = str(value).splitlines()[0]  # 개행 구분만 처리
        stdscr.addstr(
            row, 1,
            "│"
            + get_display_width(field, left_width)
            + "│"
            + get_display_width(first_line, right_width)
            + "│"
        )
        row += 1
        # 추가 줄(개행 포함하지 않는 간단 예시; 필요시 textwrap 대신 get_display_width+슬라이싱 적용)
    # 테두리 하단
    footer = "└" + "─" * left_width + "┴" + "─" * right_width + "┘"
    stdscr.addstr(row, 1, footer)

    # 네비게이션
    nav_text = "ESC=Go back | Q=Quit"
    stdscr.addstr(height - 1, 1, nav_text)
    stdscr.refresh()

    while True:
        key = stdscr.getch()
        if key in (27, ord('q'), ord('Q')):
            break

def show_no_vm_popup(stdscr):
    height, width = stdscr.getmaxyx()
    popup_height = 10
    popup_width = 44
    popup_y = (height - popup_height) // 2
    popup_x = (width - popup_width) // 2
    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.border()
    lines = [
        "",
        "",
        "",
        "No VM associated with the selected disk.",
        "",
        "",
        "",
        "Press any key to continue"
    ]
    for i, line in enumerate(lines):
        popup.addstr(i+1, 1, line.center(popup_width-2))
    popup.refresh()
    popup.getch()

def main_loop(stdscr, storage_domains, storage_info):
    init_curses_colors()   # 색상 모드 초기화 및 페어 정의
    curses.curs_set(0)
    
    current_idx = 0
    disk_selected = 0
    vm_selected = 0
    
    active_table = "storage_domain"
    
    sd_page_size = 4
    disk_page_size = 4
    
    while True:
        stdscr.erase()
        y = 1
        height, width = stdscr.getmaxyx()
        title = "■ Storage Domain"
        stdscr.addstr(y, 1, title, curses.A_BOLD)
        y += 2
        
        total_sd_pages = math.ceil(len(storage_domains) / sd_page_size) if storage_domains else 1
        sd_page = current_idx // sd_page_size
        y = draw_storage_domain_list(stdscr, storage_domains, sd_page, current_idx, storage_info, y, active=(active_table=="storage_domain"))
        y += 1
        
        selected_domain = storage_domains[current_idx]
        disks = storage_info[selected_domain]["disks"]
        
        y = draw_disk_table(stdscr, selected_domain, storage_info[selected_domain], disk_selected, disk_page_size, y, active=(active_table=="disk"))
        y += 1
        
        available_vm_rows = max(43 - y - 4, 1)
        total_vm_pages = math.ceil(len(disks) / available_vm_rows) if disks else 1
        y = draw_virtual_machines_table(stdscr, selected_domain, storage_info, vm_selected, y, available_vm_rows, active=(active_table=="virtual_machines"))
        y += 1
        
        total_disk_pages = math.ceil(len(disks) / disk_page_size) if disks else 1
        total_vm_pages = math.ceil(len(disks) / available_vm_rows) if disks else 1
        multi_page = (total_sd_pages > 1 or total_disk_pages > 1 or total_vm_pages > 1)
        
        nav_left = "TAB=Switch Focus | ▲/▼=Navigate | ENTER=View Events or Details | ESC=Go back | Q=Quit"
        if multi_page:
            nav_right = "N=Next | P=Prev"
            nav_right_start = 121 - len(nav_right) + 1
            stdscr.addstr(height - 1, 1, nav_left, curses.A_NORMAL)
            stdscr.addstr(height - 1, nav_right_start, nav_right, curses.A_NORMAL)
        else:
            stdscr.addstr(height - 1, 1, nav_left, curses.A_NORMAL)
        
        stdscr.noutrefresh()
        curses.doupdate()
        
        key = stdscr.getch()
        if key == 9:
            available_focus = ["storage_domain"]
            if disks and len(disks) > 0:
                available_focus.extend(["disk", "virtual_machines"])
            if len(available_focus) > 1:
                try:
                    current_focus_index = available_focus.index(active_table)
                except ValueError:
                    current_focus_index = 0
                next_focus_index = (current_focus_index + 1) % len(available_focus)
                active_table = available_focus[next_focus_index]
                if active_table == "disk":
                    disk_selected = 0
                elif active_table == "virtual_machines":
                    vm_selected = 0
        elif key == curses.KEY_UP:
            if active_table == "storage_domain":
                current_idx = (current_idx - 1) % len(storage_domains) if storage_domains else 0
            elif active_table == "disk":
                if disks:
                    disk_selected = (disk_selected - 1) % len(disks)
            elif active_table == "virtual_machines":
                if disks:
                    vm_selected = (vm_selected - 1) % len(disks)
        elif key == curses.KEY_DOWN:
            if active_table == "storage_domain":
                current_idx = (current_idx + 1) % len(storage_domains) if storage_domains else 0
            elif active_table == "disk":
                if disks:
                    disk_selected = (disk_selected + 1) % len(disks)
            elif active_table == "virtual_machines":
                if disks:
                    vm_selected = (vm_selected + 1) % len(disks)
        elif key in (ord('n'), ord('N')):
            if active_table == "storage_domain":
                if sd_page < total_sd_pages - 1:
                    sd_page += 1
                    current_idx = sd_page * sd_page_size
            elif active_table == "disk":
                disk_page = disk_selected // disk_page_size
                total_disk_pages = math.ceil(len(disks) / disk_page_size) if disks else 1
                if disk_page < total_disk_pages - 1:
                    disk_selected = (disk_page + 1) * disk_page_size
                else:
                    disk_selected = 0
            elif active_table == "virtual_machines":
                vm_page = vm_selected // available_vm_rows
                total_vm_pages = math.ceil(len(disks) / available_vm_rows) if disks else 1
                if vm_page < total_vm_pages - 1:
                    vm_selected = (vm_page + 1) * available_vm_rows
                else:
                    vm_selected = 0
        elif key in (ord('p'), ord('P')):
            if active_table == "storage_domain":
                if sd_page > 0:
                    sd_page -= 1
                    current_idx = sd_page * sd_page_size
            elif active_table == "disk":
                disk_page = disk_selected // disk_page_size
                if disk_page > 0:
                    disk_selected = (disk_page - 1) * disk_page_size
                else:
                    total_disk_pages = math.ceil(len(disks) / disk_page_size) if disks else 1
                    disk_selected = (total_disk_pages - 1) * disk_page_size
            elif active_table == "virtual_machines":
                vm_page = vm_selected // available_vm_rows
                if vm_page > 0:
                    vm_selected = (vm_page - 1) * available_vm_rows
                else:
                    total_vm_pages = math.ceil(len(disks) / available_vm_rows) if disks else 1
                    vm_selected = (total_vm_pages - 1) * available_vm_rows
        elif key in (ord('\n'), 10, 13):
            if active_table == "storage_domain":
                show_events_storage_domain(stdscr, connection, storage_info[selected_domain])
            elif active_table == "disk":
                if disks:
                    filtered_disks = [d for d in disks if d.get("disk_name", "").strip().upper() != "OVF_STORE"]
                    if disk_selected < len(filtered_disks):
                        selected_disk = filtered_disks[disk_selected]
                        show_disk_detail_screen(stdscr, selected_disk, selected_domain)
            elif active_table == "virtual_machines":
                if disks:
                    selected_disk = disks[vm_selected]
                    if selected_disk.get("vm_name", "-") == "-" or not selected_disk.get("vm_obj"):
                        show_no_vm_popup(stdscr)
                    else:
                        show_vm_details(stdscr, connection, selected_disk.get("vm_obj"))
        elif key in (27,):
            break
        elif key in (ord('q'), ord('Q')):
            import sys
            sys.exit(0)

# =============================================================================
# Section 10: Disk Section
# =============================================================================
def show_storage_disks(stdscr, connection):
    """
    화면의 3번째 줄에는 왼쪽에 "- Disk List"가, 오른쪽에는 "(Page X/Y)" 형식의 페이지 정보가 고정으로 보인다.
    터미널의 마지막 두 번째 줄에는 "ESC=Go back | Q=Quit | D=Disk Name | S=Size | I=Domain | V=VM Name"와
    "N=Next | P=Prev" 메시지가 표시되며, 모든 알파벳 키 입력은 대소문자 구분 없이 처리됨
    Q 또는 ESC 키 입력 시 프로그램 전체가 종료됨
    """
    PAGE_INFO_COL = 114

    # 이 코드는 커서를 숨기고 색상 기능을 초기화하는 부분
    curses.curs_set(0)
    curses.start_color()
    curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_CYAN)

    def draw_table(stdscr, disks, current_idx, page, total_pages, sort_key, reverse_sort):
        stdscr.erase()
        height, width = stdscr.getmaxyx()

        # 화면 상단에 "Disk"라는 제목을 굵게 표시함
        stdscr.addstr(1, 1, "■ Disk", curses.A_BOLD)

        # 3번째 줄에는 "- Disk List"와 페이지 정보를 출력함
        stdscr.addstr(3, 1, "- Disk List")
        if total_pages > 1:
            page_info = f"{page+1}/{total_pages}"
            start_col = 121 - len(page_info) + 1
            stdscr.addstr(3, start_col, page_info)

        table_start_row = 4
        column_widths = [51, 13, 27, 25]

        # 테이블 테두리와 구분선에 사용할 문자를 정의함
        h_line = "─"
        v_line = "│"
        corner_tl = "┌"
        corner_tr = "┐"
        corner_bl = "└"
        corner_br = "┘"
        cross = "┼"
        t_top = "┬"
        t_bottom = "┴"
        t_left = "├"
        t_right = "┤"

        # 테이블 상단의 테두리를 생성함
        header_line = corner_tl + t_top.join([h_line * w for w in column_widths]) + corner_tr
        stdscr.addstr(table_start_row, 1, header_line)

        # 각 열의 제목을 정해진 너비에 맞게 포맷한 후 헤더 셀을 생성함
        header_cells = [
            get_display_width("Disk Name", 51),
            get_display_width("Size (GB)", 13),
            get_display_width("Storage Domain", 27),
            get_display_width("VM Name", 25)
        ]
        header_text = v_line + v_line.join(header_cells) + v_line
        stdscr.addstr(table_start_row + 1, 1, header_text)

        # 헤더와 데이터 영역 사이에 구분 선을 추가함
        header_divider = t_left + cross.join([h_line * w for w in column_widths]) + t_right
        stdscr.addstr(table_start_row + 2, 1, header_divider)

        data_start_row = table_start_row + 3
        max_disks_per_page = 35
        start_index = page * max_disks_per_page

        # 정렬은 sort_key에 따라 수행되며, sort_key가 'size'인 경우 숫자 비교를 위해 float로 변환함
        sorted_disks = sorted(
            disks,
            key=lambda d: (float(d.get(sort_key, 0)) if sort_key == 'size' else d.get(sort_key, "")),
            reverse=reverse_sort
        )
        current_disks = sorted_disks[start_index:start_index + max_disks_per_page]

        # 각 디스크 데이터를 표 형식으로 출력함
        for i, disk in enumerate(current_disks):
            disk_name = disk['name'] or "N/A"
            disk_size = str(disk['size']) or "N/A"
            storage_domain = disk['storage_domain'] or "N/A"
            vm_name = disk['vm_name'] or "N/A"
            row_cells = [
                get_display_width(disk_name, 51),
                get_display_width(disk_size, 13),
                get_display_width(storage_domain, 27),
                get_display_width(vm_name, 25)
            ]
            row_str = v_line + v_line.join(row_cells) + v_line

            # 현재 선택된 행일 경우, 색상 페어를 적용하여 강조함
            if i == current_idx:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(data_start_row + i, 1, row_str)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(data_start_row + i, 1, row_str)

        # 테이블 하단에 경계선을 추가함
        table_bottom_row = data_start_row + len(current_disks)
        bottom_border = corner_bl + t_bottom.join([h_line * w for w in column_widths]) + corner_br
        stdscr.addstr(table_bottom_row, 1, bottom_border)

        # 터미널 하단에는 왼쪽에 정렬 옵션이 포함된 메시지, 오른쪽에는 페이지 이동 메시지를 표시함
        left_footer = "ESC=Go back | Q=Quit | D=Disk Name | S=Size | I=Domain | V=VM Name"
        stdscr.addstr(height - 1, 1, left_footer)
        if total_pages > 1:
            right_footer = "N=Next | P=Prev"
            start_col = 121 - len(right_footer) + 1
            stdscr.addstr(height - 1, start_col, right_footer)

        stdscr.noutrefresh()
        curses.doupdate()
        return sorted_disks, current_disks

    def draw_disk_details(stdscr, disk):
        stdscr.clear()
        stdscr.nodelay(False)
        height, width = stdscr.getmaxyx()

        # 디스크 상세 정보 화면의 헤더를 출력함
        stdscr.addstr(1, 1, "- Disk Details")
        table_start_row = 2
        column_widths = [43, 75]

        h_line = "─"
        v_line = "│"
        corner_tl = "┌"
        corner_tr = "┐"
        corner_bl = "└"
        corner_br = "┘"
        cross = "┼"
        t_top = "┬"
        t_bottom = "┴"
        t_left = "├"
        t_right = "┤"

        # 상단 테두리를 그리고, "Field"와 "Value" 헤더 셀을 출력함
        header_line = corner_tl + t_top.join([h_line * w for w in column_widths]) + corner_tr
        stdscr.addstr(table_start_row, 1, header_line)

        header_field = get_display_width("Field", column_widths[0])
        header_value = get_display_width("Value", column_widths[1])
        header_text = f"{v_line}{header_field}{v_line}{header_value}{v_line}"
        stdscr.addstr(table_start_row + 1, 1, header_text)

        # 헤더와 데이터 영역 사이에 구분 선을 추가함
        divider_row = table_start_row + 2
        divider_line = t_left + cross.join([h_line * w for w in column_widths]) + t_right
        stdscr.addstr(divider_row, 1, divider_line)

        # 디스크의 상세 정보를 (필드, 값) 쌍으로 구성한 리스트를 작성함
        details = [
            ("Name", disk['name']),
            ("Size (GB)", disk['size']),
            ("Storage Domain", disk['storage_domain']),
            ("VM Name", disk['vm_name']),
            ("Content Type", disk['content_type']),
            ("ID", disk['id']),
            ("Alias", disk.get('alias', 'N/A')),
            ("Description", disk.get('description', 'N/A')),
            ("Disk Profile", str(disk.get('disk_profile', 'N/A'))),
            ("Wipe After Delete", disk.get('wipe_after_delete', 'N/A')),
            ("Virtual Size (GB)", disk.get('virtual_size', 'N/A')),
            ("Actual Size (GB)", disk.get('actual_size', 'N/A')),
            ("Allocation Policy", disk.get('allocation_policy', 'N/A'))
        ]

        # 각 상세 정보를 행 단위로 출력함
        for i, (field, value) in enumerate(details):
            field_text = get_display_width(field, column_widths[0])
            value_text = get_display_width(str(value), column_widths[1])
            stdscr.addstr(divider_row + 1 + i, 1,
                          f"{v_line}{field_text}{v_line}{value_text}{v_line}")

        # 테이블 하단에 경계선을 추가함
        table_bottom_row = divider_row + 1 + len(details)
        bottom_border = corner_bl + t_bottom.join([h_line * w for w in column_widths]) + corner_br
        stdscr.addstr(table_bottom_row, 1, bottom_border)

        stdscr.addstr(height - 1, 1, "ESC=Go back | Q=Quit")
        stdscr.refresh()

        # ESC 또는 Q 키를 입력하면 상세 정보 화면을 종료함
        while True:
            key = stdscr.getch()
            if key == 27:  # ESC 키 입력 시 루프 종료
                return
            elif 0 <= key < 256 and chr(key).lower() == 'q':  # q 또는 Q 입력 시 프로그램 종료
                sys.exit(0)

    def fetch_disk_data(connection):
        # API를 통해 디스크, VM, 스토리지 도메인 정보를 가져온다.
        disks_service = connection.system_service().disks_service()
        vms_service = connection.system_service().vms_service()
        storage_domains_service = connection.system_service().storage_domains_service()

        disks = disks_service.list()
        data = []

        # 각 VM에 연결된 디스크 ID와 VM 이름을 매핑하는 캐시를 생성함
        vm_disk_map = {}
        for vm in vms_service.list():
            vm_name = vm.name
            try:
                attachments = vms_service.vm_service(vm.id).disk_attachments_service().list()
            except:
                attachments = []
            for attachment in attachments:
                vm_disk_map[attachment.disk.id] = vm_name

        # 각 디스크에 대해 필요한 정보를 추출함
        for disk in disks:
            if disk.name == "OVF_STORE":
                continue

            disk_name = disk.name
            disk_size = round(disk.provisioned_size / (1024 ** 3), 2)
            storage_domain_name = "N/A"
            vm_name = vm_disk_map.get(disk.id, "N/A")

            if disk.storage_domains:
                sd_id = disk.storage_domains[0].id
                try:
                    sd_obj = storage_domains_service.storage_domain_service(sd_id).get()
                    storage_domain_name = sd_obj.name
                except:
                    pass

            content_type = "data"
            if disk.content_type:
                content_type = str(disk.content_type)
            elif disk.bootable:
                content_type = "boot"
            elif disk.shareable:
                content_type = "shared"
            elif disk.format == "raw" and disk.wipe_after_delete:
                content_type = "iso"

            allocation_policy = "thin" if getattr(disk, 'thin_provisioning', False) else "thick"

            data.append({
                'name': disk_name,
                'size': disk_size,
                'storage_domain': storage_domain_name,
                'vm_name': vm_name,
                'content_type': content_type,
                'id': disk.id,
                'alias': getattr(disk, 'alias', "N/A"),
                'description': getattr(disk, 'description', "N/A"),
                'disk_profile': str(getattr(disk, 'disk_profile', "N/A")),
                'wipe_after_delete': getattr(disk, 'wipe_after_delete', False),
                'virtual_size': round(getattr(disk, 'provisioned_size', 0) / (1024 ** 3), 2),
                'actual_size': round(getattr(disk, 'actual_size', 0) / (1024 ** 3), 2),
                'allocation_policy': allocation_policy
            })

        return data

    # 전체 디스크 데이터를 API를 통해 가져옴
    disks = fetch_disk_data(connection)
    current_idx = 0          # 현재 페이지 내에서 선택된 디스크의 인덱스
    page = 0                 # 현재 페이지 번호
    max_disks_per_page = 35  # 한 페이지에 표시할 최대 디스크 수
    total_pages = (len(disks) + max_disks_per_page - 1) // max_disks_per_page
    sort_key = 'name'        # 초기 정렬 기준은 Disk Name
    reverse_sort = False     # 초기 정렬 순서는 오름차순

    # 메인 이벤트 루프: 입력 키는 대소문자 구분 없이 처리됨
    while True:
        sorted_disks, current_disks = draw_table(
            stdscr, disks, current_idx, page, total_pages, sort_key, reverse_sort
        )
        num_disks = len(current_disks)
        key = stdscr.getch()
        ch = chr(key).lower() if 0 <= key < 256 else ""

        # 위 방향키 또는 'a' 입력 시
        if key == curses.KEY_UP or ch == 'a':
            if num_disks > 0:
                # 첫 번째 항목에서 위로 → 이전 페이지로
                if key == curses.KEY_UP and current_idx == 0 and total_pages > 1:
                    page = (page - 1) % total_pages
                    # 이전 페이지의 디스크 개수 계산
                    start_idx = page * max_disks_per_page
                    end_idx = min(start_idx + max_disks_per_page, len(disks))
                    current_idx = end_idx - start_idx - 1
                else:
                    # 그 외에는 한 행 위로
                    current_idx = max(0, current_idx - 1)

        # 아래 방향키 또는 'b' 입력 시
        elif key == curses.KEY_DOWN or ch == 'b':
            if num_disks > 0:
                # 마지막 항목에서 아래로 → 다음 페이지로
                if key == curses.KEY_DOWN and current_idx == num_disks - 1 and total_pages > 1:
                    page = (page + 1) % total_pages
                    current_idx = 0
                else:
                    # 그 외에는 한 행 아래로
                    current_idx = min(current_idx + 1, num_disks - 1)

        # 페이지 이동 단축키 (n: Next, p: Prev)
        elif ch == 'n':
            page = (page + 1) % total_pages
            current_idx = 0
        elif ch == 'p':
            page = (page - 1) % total_pages
            current_idx = 0

        # 그 외 키 처리 (정렬, 상세보기, 종료 등) …

        # 이름 정렬 (d/D)
        elif ch == 'd':
            reverse_sort = not reverse_sort if sort_key == 'name' else False
            sort_key = 'name'
        # 크기 정렬 (s/S)
        elif ch == 's':
            reverse_sort = not reverse_sort if sort_key == 'size' else False
            sort_key = 'size'
        # 스토리지 도메인 정렬 (i/I)
        elif ch == 'i':
            reverse_sort = not reverse_sort if sort_key == 'storage_domain' else False
            sort_key = 'storage_domain'
        # VM 이름 정렬 (v/V)
        elif ch == 'v':
            reverse_sort = not reverse_sort if sort_key == 'vm_name' else False
            sort_key = 'vm_name'
        # 엔터 키 입력 시 상세 정보 표시
        elif key == 10:
            if num_disks > 0:
                selected_disk = current_disks[current_idx]
                draw_disk_details(stdscr, selected_disk)
        # 종료 (q/Q)
        elif ch == 'q':
            sys.exit(0)
        # ESC 키 입력 시 함수 종료
        elif key == 27:
            return

# =============================================================================
# Section 11: User Section
# =============================================================================
import getpass
# 로컬 사용자가 root이면 SSH 명령어 앞에 sudo -u rutilvm 추가
if getpass.getuser() == "root":
    SSH_PREFIX = "sudo -u rutilvm "
else:
    SSH_PREFIX = ""

# 사용자 목록 캐싱: 동일 호스트에 대해 5초간 캐시된 결과 재사용
_USERS_CACHE = {}
_CACHE_TIMEOUT = 5  # seconds

def clear_users_cache(engine_host):
    """
    지정된 호스트의 캐시를 제거함
    """
    global _USERS_CACHE
    if engine_host in _USERS_CACHE:
        del _USERS_CACHE[engine_host]

def force_truncate_line(text, max_width):
    """
    text의 실제 출력 폭이 max_width를 초과하거나
    메시지의 남은 내용이 있을 경우, 반드시 마지막에 ".."가 붙도록 강제 truncation 함.
    (동아시아 문자는 2칸으로 계산)
    """
    truncated = ""
    current = 0
    for char in text:
        char_w = 2 if unicodedata.east_asian_width(char) in ('F', 'W') else 1
        if current + char_w > max_width - 2:
            break
        truncated += char
        current += char_w
    return truncated + ".."

def display_length(text):
    """텍스트의 실제 출력 너비를 계산 (동아시아 문자는 2칸)"""
    return sum(2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1 for c in text)

def show_custom_popup(stdscr, title, message):
    """
    일반 메시지 팝업을 표시하며, 메시지 텍스트를 중앙 정렬함
    """
    popup_height = 12
    popup_width = 60
    scr_height, scr_width = stdscr.getmaxyx()
    popup_y = (scr_height - popup_height) // 2
    popup_x = (scr_width - popup_width) // 2
    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)
    curses.curs_set(0)
    popup.border()
    # 제목 중앙 정렬 (굵은 글씨)
    popup.addstr(1, (popup_width - len(title)) // 2, title)
    # 메시지 라인들을 중앙 정렬하여 표시
    message_lines = textwrap.wrap(message, width=popup_width - 4)
    start_line = 5
    for i, line in enumerate(message_lines):
        if start_line + i >= popup_height - 2:
            break
        popup.addstr(start_line + i, (popup_width - len(line)) // 2, line)
    prompt = "Press any key to continue"
    popup.addstr(popup_height - 2, (popup_width - len(prompt)) // 2, prompt, curses.A_NORMAL)
    popup.refresh()
    popup.getch()

def add_user_popup_form(stdscr, connection, refresh_users_callback):
    """
    사용자 추가 팝업창을 표시하고, SSH 및 oVirt API를 통해 새 사용자를 생성함.

    stdscr: curses 표준 화면
    connection: oVirt API 연결 객체
    refresh_users_callback: 사용자 목록 새로고침 콜백 함수
    """
    
    # 팝업창 크기 및 위치 설정
    popup_height = 13
    popup_width = 60
    scr_height, scr_width = stdscr.getmaxyx()
    popup_y = (scr_height - popup_height) // 2
    popup_x = (scr_width - popup_width) // 2

    # 팝업 윈도우 생성
    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)
    curses.curs_set(1)  # 커서 표시

    # oVirt 호스트 주소 추출
    parsed_url = urlparse(connection.url)
    engine_host = parsed_url.hostname

    # 사용자 입력 루프
    while True:
        popup.clear()
        popup.border()
        header = "Add New User"
        popup.addstr(1, (popup_width - len(header)) // 2, header)

        # 필드 라벨 출력
        popup.addstr(4, 2, "Username   :")
        popup.addstr(5, 2, "Password   :")
        popup.addstr(6, 2, "Re-Password:")

        popup.addstr(popup_height - 3, 2, " " * (popup_width - 4))
        instruction = "ENTER=Commit | ESC=Cancel"
        popup.addstr(popup_height - 2, (popup_width - len(instruction)) // 2, instruction)

        # 입력 필드 정의 (위치, 길이, 비밀번호 마스킹 여부 포함)
        fields = [
            {"label": "Username   :", "value": "", "y": 4, "x": 2 + len("Username   :") + 1, "max_len": 30, "hidden": False},
            {"label": "Password   :", "value": "", "y": 5, "x": 2 + len("Password   :") + 1, "max_len": 30, "hidden": True},
            {"label": "Re-Password:", "value": "", "y": 6, "x": 2 + len("Re-Password:") + 1, "max_len": 30, "hidden": True},
        ]
        current_field = 0
        popup.move(fields[0]["y"], fields[0]["x"])
        popup.refresh()

        # 필드 입력 루프
        while True:
            # 각 필드 값 출력 (비밀번호는 *로 마스킹)
            for idx, field in enumerate(fields):
                display_val = field["value"] if not field["hidden"] else "*" * len(field["value"])
                popup.addstr(field["y"], field["x"], " " * field["max_len"])
                popup.addstr(field["y"], field["x"], display_val)

            # 커서 위치 갱신
            popup.move(fields[current_field]["y"], fields[current_field]["x"] + len(fields[current_field]["value"]))
            popup.refresh()

            ch = popup.getch()

            # Tab 또는 ↓ 키: 다음 필드로 이동
            if ch in (9, curses.KEY_DOWN):
                current_field = (current_field + 1) % len(fields)
            elif ch == curses.KEY_UP:
                current_field = (current_field - 1) % len(fields)
            elif ch == 27:  # ESC: 취소
                return
            elif ch in (curses.KEY_ENTER, 10, 13):  # 엔터 입력 시 확인 및 유효성 검사
                if all(field["value"] for field in fields):
                    if fields[1]["value"] != fields[2]["value"]:
                        # 비밀번호 불일치 오류 메시지
                        curses.curs_set(0)
                        popup.addstr(8, 2, "Passwords do not match!")
                        popup.refresh()
                        curses.napms(1500)
                        popup.addstr(8, 2, " " * (popup_width - 4))
                        popup.refresh()
                        curses.curs_set(1)
                        continue
                    else:
                        break
                else:
                    # 빈 필드 오류 메시지
                    curses.curs_set(0)
                    popup.addstr(8, 2, "All fields are required!")
                    popup.refresh()
                    curses.napms(1500)
                    popup.addstr(8, 2, " " * (popup_width - 4))
                    popup.refresh()
                    curses.curs_set(1)
                    continue
            elif ch in (curses.KEY_BACKSPACE, 127, 8):
                if fields[current_field]["value"]:
                    fields[current_field]["value"] = fields[current_field]["value"][:-1]
            elif 0 <= ch < 256:  # 일반 문자 입력
                if len(fields[current_field]["value"]) < fields[current_field]["max_len"]:
                    fields[current_field]["value"] += chr(ch)

        username = fields[0]["value"].strip()
        new_password = fields[1]["value"]

        # 사용자 중복 확인 (SSH 통해 grep)
        try:
            check_user_cmd = f"ovirt-aaa-jdbc-tool query --what=user | grep -w '{username}'"
            ssh_check_cmd =  f"{SSH_PREFIX}ssh {get_ssh_prefix()} -o StrictHostKeyChecking=no rutilvm@{engine_host} \"{check_user_cmd}\""
            check_result = subprocess.run(ssh_check_cmd, shell=True,
                                          stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
            if check_result.returncode == 0:
                curses.curs_set(0)
                popup.addstr(8, 2, "User already exists!")
                popup.refresh()
                curses.napms(1500)
                popup.addstr(8, 2, " " * (popup_width - 4))
                popup.refresh()
                curses.curs_set(1)
                fields[0]["value"] = ""  # 사용자명만 초기화
                continue
        except Exception:
            curses.curs_set(0)
            show_error_popup(stdscr, "Error", "Error checking user!")
            popup.refresh()
            curses.napms(1500)
            curses.curs_set(1)
            continue
        break

    # ───────────────────────────────────────────────────────────────────
    # 사용자 계정 추가중 표시 (Add New User 팝업 유지)
    status_msg = "Adding user account..."
    # 커서 숨기기 (깜빡이는 커서 제거)
    curses.curs_set(0)
    # 팝업 중앙에 깜빡이는(blink) 속성으로 출력 (느린 깜빡임: 1초)
    popup.addstr(
        8,
        (popup_width - len(status_msg)) // 2,
        status_msg,
        curses.A_BLINK
    )
    popup.refresh()
    # 1초 대기해서 느리게 깜빡이도록 함
    curses.napms(1000)
    # 커서 숨김 유지
    curses.curs_set(0)
    # ───────────────────────────────────────────────────────────────────

    # 사용자 생성 (ovirt-aaa-jdbc-tool user add)
    try:
        add_user_cmd = f"ovirt-aaa-jdbc-tool user add {username} >/dev/null 2>&1"
        ssh_add_cmd =  f"{SSH_PREFIX}ssh {get_ssh_prefix()} -o StrictHostKeyChecking=no rutilvm@{engine_host} \"{add_user_cmd}\""
        subprocess.run(ssh_add_cmd, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        show_error_popup(stdscr, "Error",  f"{SSH_PREFIX}ssh Error during user add: {str(e)}")
        return

    # 사용자에게 firstName 설정
    try:
        first_name_cmd = f"ovirt-aaa-jdbc-tool user edit {username} --attribute=firstName={username}"
        ssh_firstname_cmd =  f"{SSH_PREFIX}ssh {get_ssh_prefix()} -o StrictHostKeyChecking=no rutilvm@{engine_host} \"{first_name_cmd}\""
        subprocess.run(ssh_firstname_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        show_error_popup(stdscr, "Error", f"Error setting firstName: {str(e)}")
        return

    # 비밀번호 설정
    if not set_user_password(engine_host, username, new_password, stdscr):
        show_error_popup(stdscr, "Error", "Failed to set password.")
        return

    # 비밀번호 만료일 설정
    try:
        edit_cmd = f'ovirt-aaa-jdbc-tool user edit {username} --password-valid-to="2125-12-31 12:00:00-0000"'
        ssh_edit_cmd =  f"{SSH_PREFIX}ssh {get_ssh_prefix()} -o StrictHostKeyChecking=no rutilvm@{engine_host} {shlex.quote(edit_cmd)}"
        subprocess.run(ssh_edit_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        show_error_popup(stdscr, "Error", f"Error setting password valid date: {str(e)}")
        return

    # API를 통한 사용자 역할 및 webAdmin 속성 업데이트 (병렬 처리)
    try:
        # 역할 및 권한 업데이트: new_user_obj를 반환하도록 함
        def update_role():
            users_service = connection.system_service().users_service()
            new_user_obj = next((u for u in users_service.list() if getattr(u, "name", "") == username), None)
            if not new_user_obj:
                new_user_obj = users_service.add(
                    User(
                        user_name=f"{username}@internal-authz",
                        domain=Domain(name="internal-authz")
                    )
                )
            roles_service = connection.system_service().roles_service()
            super_user_role = next((r for r in roles_service.list() if r.name == "SuperUser"), None)
            if super_user_role:
                permissions_service = connection.system_service().permissions_service()
                permissions_service.add(Permission(role=super_user_role, user=new_user_obj))
            return new_user_obj

        # 첫번째 API 호출을 별도 스레드로 실행하여 new_user_obj를 얻음
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_role = executor.submit(update_role)
            new_user_obj = future_role.result(timeout=15)

        # 두번째 API 호출(webAdmin 업데이트)은 new_user_obj에 의존하므로 별도 스레드에서 실행
        def update_webadmin(user_obj):
            OVIRT_URL = connection.url
            USER_ID = user_obj.id
            webadmin_url = f"{OVIRT_URL}/users/{USER_ID}"
            webadmin_data = "<user><webAdmin>true</webAdmin></user>"
            new_user_account = f"{username}@internal"
            try:
                requests.put(
                    webadmin_url,
                    data=webadmin_data,
                    auth=HTTPBasicAuth(new_user_account, new_password),
                    headers={"Content-Type": "application/xml", "Accept": "application/xml"},
                    verify=False
                )
            except Exception:
                pass

        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(update_webadmin, new_user_obj)
    except Exception:
        pass

    # 완료 메시지 출력
    popup.clear()
    popup.border()
    complete_msg = f"User {username} created successfully"
    popup.addstr(6, (popup_width - len(complete_msg)) // 2, complete_msg, curses.A_NORMAL)
    success_prompt = "Press any key to continue"
    popup.addstr(popup_height - 2, (popup_width - len(success_prompt)) // 2, success_prompt)
    popup.refresh()
    popup.getch()

    # 사용자 목록 캐시 초기화 및 화면 갱신
    clear_users_cache(engine_host)
    refresh_users_callback()
    curses.curs_set(0)  # 커서 숨김

def parse_user_query_output(output):
    """
    ovirt-aaa-jdbc-tool의 출력 결과를 파싱하여 사용자 리스트를 반환함

    출력 예시:
        -- User alice (9d01e580-aaaa-bbbb-cccc-123456789abc)
          Email: alice@example.com
          Account Disabled: false
          Account Locked: true
        -- User bob (1e2e3d4c-ffff-eeee-dddd-0123456789de)
          Account Disabled: false

    반환 형식:
        [
            {
                "Name": "alice",
                "ID": "9d01e580-aaaa-bbbb-cccc-123456789abc",
                "Email": "alice@example.com",
                "Account Disabled": "false",
                "Account Locked": "true"
            },
            ...
        ]
    """

    users = []               # 최종 사용자 리스트를 저장할 리스트
    current_user = None      # 현재 파싱 중인 사용자 정보를 임시 저장할 딕셔너리

    # 출력 결과를 줄 단위로 처리
    for line in output.splitlines():
        line = line.strip()  # 앞뒤 공백 제거

        # 빈 줄 또는 Java 런타임 메시지는 무시
        if not line or line.startswith("Picked up"):
            continue

        # 사용자 시작 지점인 "-- User <name> (<uuid>)" 라인을 찾음
        if line.startswith("-- User"):
            # 이전 사용자가 존재한다면 리스트에 추가
            if current_user is not None:
                users.append(current_user)

            # 새로운 사용자 정보 딕셔너리 생성
            current_user = {}

            # 정규 표현식으로 사용자명과 ID 추출
            m = re.search(r"-- User\s+(\S+)\s*\(([^)]+)\)", line)
            if m:
                current_user["Name"] = m.group(1)  # 예: alice
                current_user["ID"] = m.group(2)    # 예: UUID 값
        else:
            # 속성 정보 라인인 경우 (예: "Email: something")
            if ":" in line and current_user is not None:
                key, val = line.split(":", 1)  # ':' 기준으로 분리
                current_user[key.strip()] = val.strip()  # key와 value 모두 공백 제거 후 저장

    # 마지막 사용자 정보가 있다면 추가
    if current_user:
        users.append(current_user)

    return users  # 사용자 딕셔너리 리스트 반환

def reset_password_popup_form(stdscr, connection, usernames):
    """
    Popup form to reset password for one or more selected users.
    usernames: list of usernames whose password will be reset.
    """
    popup_height = 11
    popup_width = 60
    scr_height, scr_width = stdscr.getmaxyx()
    popup_y = (scr_height - popup_height) // 2
    popup_x = (scr_width - popup_width) // 2

    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)
    curses.curs_set(1)

    # Input fields: New Password, Re-Password
    fields = [
        {"label": "New Password :", "value": "", "y": 3, "x": 2 + len("New Password :") + 1, "max_len": 30, "hidden": True},
        {"label": "Re-Password  :", "value": "", "y": 4, "x": 2 + len("Re-Password  :") + 1, "max_len": 30, "hidden": True},
    ]
    header = "Reset Password"

    while True:
        popup.clear()
        popup.border()
        popup.addstr(1, (popup_width - len(header)) // 2, header)
        for field in fields:
            popup.addstr(field["y"], 2, field["label"])
        instr = "ENTER=Commit | ESC=Cancel"
        popup.addstr(popup_height - 2, (popup_width - len(instr)) // 2, instr)

        current = 0
        popup.move(fields[current]["y"], fields[current]["x"])
        popup.refresh()

        while True:
            for f in fields:
                disp = f["value"] if not f["hidden"] else "*" * len(f["value"])
                popup.addstr(f["y"], f["x"], " " * f["max_len"])
                popup.addstr(f["y"], f["x"], disp)
            popup.move(fields[current]["y"], fields[current]["x"] + len(fields[current]["value"]))
            popup.refresh()
            ch = popup.getch()
            if ch in (9, curses.KEY_DOWN):
                current = (current + 1) % len(fields)
            elif ch == curses.KEY_UP:
                current = (current - 1) % len(fields)
            elif ch in (27,):  # ESC
                curses.curs_set(0)
                return None
            elif ch in (10, 13):  # ENTER
                if all(f["value"] for f in fields):
                    if fields[0]["value"] != fields[1]["value"]:
                        curses.curs_set(0)
                        msg = "Passwords do not match"
                        x = (popup_width - len(msg)) // 2
                        popup.addstr(6, x, msg)
                        popup.refresh()
                        curses.napms(1500)
                        popup.addstr(6, x, " " * len(msg))
                        popup.refresh()
                        curses.curs_set(1)
                        continue
                    else:
                        new_pwd = fields[0]["value"]
                        curses.curs_set(0)
                        # apply to each user
                        results = []
                        parsed_url = urlparse(connection.url)
                        engine_host = parsed_url.hostname
                        for user in usernames:
                            ok = set_user_password(engine_host, user, new_pwd, stdscr)
                            if ok:
                                results.append(f"{user}: success")
                            else:
                                results.append(f"{user}: failed")
                        # 비밀번호 변경 완료 팝업 
                        username = usernames[0] if len(usernames) == 1 else ", ".join(usernames)
                        status = "Password change for user account was successful"
                        res_win = curses.newwin(popup_height, popup_width, popup_y, popup_x)
                        res_win.border()
                        res_win.addstr(
                            4,
                            (popup_width - len(username)) // 2,
                            username
                        )
                        res_win.addstr(
                            5,
                            (popup_width - len(status)) // 2,
                            status
                        )
                        instr = "Press any key to continue"
                        res_win.addstr(
                            popup_height - 2,
                            (popup_width - len(instr)) // 2,
                            instr
                        )
                        res_win.refresh()
                        res_win.getch()
                        res_win.clear()
                        stdscr.touchwin()
                        stdscr.refresh()
                        return
                else:
                    popup.addstr(6, 2, "All fields required!", curses.A_BOLD)
                    popup.refresh(); curses.napms(1500)
                    popup.addstr(6, 2, " " * (popup_width - 4))
                    popup.refresh(); continue
            elif ch in (127, curses.KEY_BACKSPACE, 8):
                if fields[current]["value"]:
                    fields[current]["value"] = fields[current]["value"][:-1]
            elif 0 <= ch < 256:
                if len(fields[current]["value"]) < fields[current]["max_len"]:
                    fields[current]["value"] += chr(ch)

def show_user_details(stdscr, connection, user):
    """
    선택한 사용자의 상세 정보를 curses UI로 표시함

    매개변수:
    - stdscr: curses 표준 화면 객체
    - connection: oVirt API 연결 객체
    - user: 사용자 정보가 담긴 딕셔너리 (Name 필드 포함)
    """
    # oVirt 연결 객체에서 호스트명 추출
    parsed_url = urlparse(connection.url)
    engine_host = parsed_url.hostname

    # 사용자 이름 추출 (없으면 "-")
    username = user.get("Name", "-")

    # 사용자 상세 정보를 조회하는 SSH 명령어
    details_cmd = (
         f"{SSH_PREFIX}ssh {get_ssh_prefix()} -o StrictHostKeyChecking=no rutilvm@{engine_host} "
        f"\"ovirt-aaa-jdbc-tool user show {username}\""
    )

    # SSH 명령어 실행 시도
    try:
        result = subprocess.run(
            details_cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            timeout=15
        )
    except Exception as e:
        # SSH 실행 자체가 실패했을 경우 에러 팝업 표시
        show_error_popup(stdscr, "Error", f"Failed to execute details command: {str(e)}")
        return

    # 명령 실행은 되었지만 오류 코드 반환 시
    if result.returncode != 0:
        show_error_popup(stdscr, "Error", f"Failed to get user details: {result.stderr.strip()}")
        return

    # 사용자 상세 정보 파싱 (key: value 형태)
    details = {}
    for line in result.stdout.splitlines():
        line = line.strip()
        if not line or line.startswith("-- User"):
            continue  # 빈 줄이나 설명 헤더는 무시
        if ":" in line:
            key, val = line.split(":", 1)
            details[key.strip()] = val.strip()

    # 화면에 표시할 필드의 순서를 정의
    fields_order = [
        "Name", "ID", "Display Name", "Email", "First Name", "Last Name",
        "Department", "Title", "Description", "Account Disabled",
        "Account Locked", "Account Unlocked At", "Account Valid From",
        "Account Valid To", "Account Without Password", "Last successful Login At",
        "Last unsuccessful Login At", "Password Valid To"
    ]

    # curses 화면 초기화
    stdscr.clear()
    height, width = stdscr.getmaxyx()  # 현재 터미널 크기
    title = f"- User Details for {username}"  # 타이틀 문자열
    stdscr.addstr(1, 1, title, curses.A_DIM)  # 흐리게 출력

    # 내부 테이블 너비 설정 (121 전체 너비 중 테두리, 여백 고려)
    table_inner_width = 117
    content_lines = []

    # 각 필드의 값을 구성하고 폭을 맞춤
    for field in fields_order:
        value = details.get(field, "-")  # 값이 없으면 "-"
        content = f"{field}: {value}"
        if len(content) > table_inner_width:
            content = content[:table_inner_width]  # 길이 제한
        content_lines.append(content)

    # 테이블 상단/하단 테두리 생성
    top_border = "┌" + "─" * (table_inner_width + 2) + "┐"
    bottom_border = "└" + "─" * (table_inner_width + 2) + "┘"

    # 전체 테이블 행 구성
    table_rows = [top_border]
    for line in content_lines:
        # 좌우 테두리 및 폭 맞추기
        table_rows.append("│ " + line.ljust(table_inner_width) + " │")
    table_rows.append(bottom_border)

    # 실제 출력 시작 위치 y 좌표
    start_y = 2
    for idx, row in enumerate(table_rows):
        stdscr.addstr(start_y + idx, 1, row)  # 1열에 시작

    # 하단 안내 문구 출력
    footer_text = "ESC=Go back | Q=Quit"
    stdscr.addstr(height - 1, 1, footer_text, curses.A_DIM)
    stdscr.refresh()

    # 키 입력 대기 루프
    while True:
        key = stdscr.getch()
        if key == 27:  # ESC
            break
        elif key in (ord('q'), ord('Q')):  # Q 키를 누르면 프로그램 종료
            sys.exit(0)

def show_users(stdscr, connection):
    """
    curses 인터페이스에 사용자 목록을 121열 크기의 테이블 형식으로 표시함

    기능:
    - 사용자 목록 표시 (페이지네이션 지원)
    - 사용자의 잠금 해제
    - 사용자 추가
    - 선택 및 상세 조회
    - 선택 사용자 비밀번호 리셋 (R)

    단축키:
    ▲/▼: Navigate | SPACE: Select | ENTER: Details | U: Unlock | A: Add | R: Reset Password | ESC: Go back | Q: Quit | N/P: Next/Prev Page
    """
    # curses 색상 설정 및 모드 초기화
    init_curses_colors()
    curses.curs_set(0)
    curses.cbreak()
    stdscr.timeout(50)

    fixed_width = 121  # 화면 최소 너비

    # oVirt 엔진 호스트 이름 추출
    parsed_url = urlparse(connection.url)
    engine_host = parsed_url.hostname

    # 사용자 목록 가져오기
    try:
        output = get_users_output(engine_host)
    except Exception as e:
        show_error_popup(stdscr, "Error", f" {str(e)}")
        return
    users = parse_user_query_output(output)

    # 상태 초기화
    selected_users = set()
    current_row = 0
    rows_per_page = 25
    total_users = len(users)
    total_pages = max(1, (total_users + rows_per_page - 1) // rows_per_page)
    current_page = 0

    # 테이블 컬럼 설정
    col_widths = [24, 17, 17, 19, 14, 23]
    headers = ["Username", "Account Disabled", "Account Locked", "First Name", "Last Name", "Email"]

    # 하단 안내문구
    footer_left = (
        "▲/▼=Navigate | SPACE=Select | ENTER=Details | U=Unlock | A=Add | "
        "R=Reset Password | ESC=Go back | Q=Quit"
    )
    footer_right = "N=Next | P=Prev" if total_pages > 1 else ""

    while True:
        stdscr.erase()
        height, width = stdscr.getmaxyx()

        # 터미널 크기 체크
        if height < 20 or width < fixed_width:
            stdscr.addstr(0, 0, f"Resize terminal to at least {fixed_width}x20.", curses.A_BOLD)
            stdscr.refresh()
            continue

        # 제목 및 페이지 정보
        stdscr.addstr(1, 1, "■ User", curses.A_BOLD)
        stdscr.addstr(3, 1, f"- User List (Total User {total_users})")
        if total_pages > 1:
            page_info = f"{current_page+1}/{total_pages}"
            stdscr.addstr(3, fixed_width - len(page_info), page_info)

        # 헤더 테이블
        stdscr.addstr(4, 1, "┌" + "┬".join("─" * w for w in col_widths) + "┐")
        header_cells = [h.ljust(w)[:w] for h, w in zip(headers, col_widths)]
        stdscr.addstr(5, 1, "│" + "│".join(header_cells) + "│")
        stdscr.addstr(6, 1, "├" + "┼".join("─" * w for w in col_widths) + "┤")

        # 사용자 행 출력
        start_idx = current_page * rows_per_page
        end_idx = min(start_idx + rows_per_page, total_users)
        displayed_count = end_idx - start_idx
        for idx, user in enumerate(users[start_idx:end_idx]):
            row_y = 7 + idx
            marker = "[x] " if (start_idx + idx) in selected_users else "[ ] "
            row_data = [
                (marker + user.get("Name", "-")).ljust(col_widths[0])[:col_widths[0]],
                user.get("Account Disabled", "-").ljust(col_widths[1])[:col_widths[1]],
                user.get("Account Locked", "-").ljust(col_widths[2])[:col_widths[2]],
                user.get("First Name", "-").ljust(col_widths[3])[:col_widths[3]],
                user.get("Last Name", "-").ljust(col_widths[4])[:col_widths[4]],
                user.get("Email", "-").ljust(col_widths[5])[:col_widths[5]],
            ]
            row_text = "│" + "│".join(row_data) + "│"
            if idx == current_row:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(row_y, 1, row_text)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(row_y, 1, row_text)

        # 테이블 하단 경계
        stdscr.addstr(7 + displayed_count, 1, "└" + "┴".join("─" * w for w in col_widths) + "┘")

        # 하단 안내문구
        stdscr.addstr(height - 1, 1, footer_left)
        if footer_right:
            stdscr.addstr(height - 1, fixed_width - len(footer_right), footer_right)

        stdscr.refresh()

        # 키 입력 처리
        key = stdscr.getch()
        if key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key == 27:  # ESC
            break
        elif key == curses.KEY_UP and displayed_count > 0:
            current_row = (current_row - 1) % displayed_count
        elif key == curses.KEY_DOWN and displayed_count > 0:
            current_row = (current_row + 1) % displayed_count
        elif key in (ord('n'), ord('N')) and total_pages > 1 and current_page < total_pages - 1:
            current_page += 1
            current_row = 0
        elif key in (ord('p'), ord('P')) and total_pages > 1 and current_page > 0:
            current_page -= 1
            current_row = 0
        elif key == ord(' '):  # SPACE
            user_index = start_idx + current_row
            if user_index in selected_users:
                selected_users.remove(user_index)
            else:
                selected_users.add(user_index)
        elif key in (10, 13):  # ENTER
            user_index = start_idx + current_row
            show_user_details(stdscr, connection, users[user_index])
        elif key in (ord('a'), ord('A')):  # A: 사용자 추가
            add_user_popup_form(stdscr, connection, lambda: None)
            clear_users_cache(engine_host)
            try:
                output = get_users_output(engine_host)
                users = parse_user_query_output(output)
                total_users = len(users)
                total_pages = max(1, (total_users + rows_per_page - 1) // rows_per_page)
                current_page = 0
                current_row = 0
            except Exception as e:
                show_error_popup(stdscr, "Error", f"Failed to refresh users: {str(e)}")
            curses.curs_set(0)
        elif key in (ord('u'), ord('U')):  # U: 사용자 잠금 해제
            # 기존 Unlock 로직 유지
            already_unlocked = []
            other_results = []
            for user_index in sorted(selected_users):
                selected_user = users[user_index]
                username = selected_user.get("Name")
                if not username or username == "-":
                    other_results.append("User with invalid name skipped.")
                    continue
                if selected_user.get("Account Locked", "").strip().lower() != "true":
                    already_unlocked.append(username)
                    continue
                unlock_cmd = (
                    f"{SSH_PREFIX}ssh {get_ssh_prefix()} -o StrictHostKeyChecking=no rutilvm@{engine_host} "
                    f"\"ovirt-aaa-jdbc-tool user unlock {username}\""
                )
                try:
                    result = subprocess.run(unlock_cmd, shell=True, stdout=subprocess.PIPE,
                                             stderr=subprocess.PIPE, universal_newlines=True, timeout=15)
                    if result.returncode == 0:
                        other_results.append(f"User {username} unlocked successfully.")
                    else:
                        other_results.append(f"User {username} unlock failed: {result.stderr.strip()}")
                except Exception as e:
                    other_results.append(f"User {username} unlock error: {str(e)}")
            selected_users.clear()
            messages = []
            if already_unlocked:
                messages.append("User " + ", ".join(already_unlocked) + " is already unlocked.")
            messages.extend(other_results)
            show_custom_popup(stdscr, "", "\n".join(messages))
        elif key in (ord('r'), ord('R')):  # R: 비밀번호 리셋
            if not selected_users:
                continue
            usernames = [users[i]['Name'] for i in selected_users]
            reset_password_popup_form(stdscr, connection, usernames)
            selected_users.clear()
            try:
                output = get_users_output(engine_host)
                users = parse_user_query_output(output)
            except Exception as e:
                show_error_popup(stdscr, "Error", f"Failed to refresh users: {str(e)}")
    # End while
# End def show_users

def set_user_password(engine_host, username, new_password, stdscr):
    """
    pexpect를 이용하여 SSH 세션에서 oVirt 사용자 계정의 비밀번호 재설정 과정을 자동화함

    매개변수:
    - engine_host: oVirt 엔진 호스트의 주소 (예: 192.168.x.x 또는 FQDN)
    - username: 비밀번호를 변경할 사용자 이름
    - new_password: 설정할 새 비밀번호 문자열
    - stdscr: curses 화면 객체 (에러 팝업 등 용도로 사용 가능)

    반환값:
    - 성공 시 True
    - 실패 또는 예외 발생 시 False
    """

    try:
        # SSH 명령어 구성
        # -tt: 강제로 TTY 할당 (패스워드 입력 프롬프트가 TTY를 요구할 수 있음)
        # StrictHostKeyChecking=no: 호스트 키 확인 생략 (자동화 목적)
        cmd = (
             f"{SSH_PREFIX}ssh {get_ssh_prefix()} -tt -o StrictHostKeyChecking=no rutilvm@{engine_host} "
            f"\"/usr/bin/ovirt-aaa-jdbc-tool user password-reset {username}\""
        )

        # pexpect를 이용하여 SSH 명령 실행
        # encoding='utf-8': 문자열 기반 입출력
        # timeout=15: 각 단계에서 15초 이상 대기하지 않음
        child = pexpect.spawn(cmd, encoding='utf-8', timeout=15)

        # 비밀번호 입력 프롬프트 탐지용 정규 표현식
        # "New password:" 또는 "Password:" 등 다양한 표현을 포괄적으로 처리 (대소문자 무시)
        password_prompt_regex = re.compile(r'(?i)(new password|password):')

        # 첫 번째 비밀번호 입력 프롬프트 대기
        child.expect(password_prompt_regex)

        # 새 비밀번호 입력
        child.sendline(new_password)

        # 두 번째 비밀번호 확인 입력 프롬프트 대기
        child.expect(password_prompt_regex, timeout=15)

        # 동일한 새 비밀번호 다시 입력
        child.sendline(new_password)

        # 명령 실행 완료 (EOF) 대기
        child.expect(pexpect.EOF, timeout=15)

        # 세션 종료 및 정리
        child.close()

        # 예외 없이 모두 정상 처리된 경우 True 반환
        return True

    except Exception:
        # 예외 발생 시 False 반환
        return False

# =============================================================================
# Section 12: Certificate Section
# =============================================================================
def get_engine_hostname(ip):
    """
    주어진 IP 주소에 대해 역 DNS 조회를 시도하여 호스트명을 반환
    실패 시 IP 문자열을 그대로 반환
    """
    try:
        return socket.gethostbyaddr(ip)[0]
    except Exception:
        return ip

from datetime import datetime, timezone

def get_cert_info(cert_name, cmd):
    """
    주어진 셸 명령(cmd)을 실행하여 인증서의 notBefore와 notAfter 날짜를 파싱하고,
    유효기간(Expiration Period)과 남은 일수(Expiration D-Day)를 계산하여 dict로 반환
    SSH 명령어에 echo로 출력한 "HOSTNAME:" 라인은 무시함
    """
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            stdout=PIPE,                # 표준출력 캡처 (Python 3.6 호환)
            stderr=PIPE,                # 표준에러 캡처
            universal_newlines=True,
            timeout=15
        )
        if result.returncode != 0:
            # 명령 실패 시 stderr 반환
            return {
                "Certificate": cert_name,
                "Expiration date": "Error",
                "Expiration Period": result.stderr.strip(),
                "Expiration D-Day": ""
            }

        output = result.stdout
        notBefore_line = None
        notAfter_line  = None
        for line in output.splitlines():
            if line.startswith("HOSTNAME:"):
                continue
            if line.startswith("notBefore="):
                notBefore_line = line.split("=", 1)[1].strip().rstrip(" GMT")
            elif line.startswith("notAfter="):
                notAfter_line  = line.split("=", 1)[1].strip().rstrip(" GMT")

        if notBefore_line and notAfter_line:
            # 문자열을 datetime 객체로 변환
            nb = datetime.strptime(notBefore_line, "%b %d %H:%M:%S %Y").replace(tzinfo=timezone.utc)
            na = datetime.strptime(notAfter_line,  "%b %d %H:%M:%S %Y").replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)

            return {
                "Certificate": cert_name,
                "Expiration date":    na.strftime("%b %d %H:%M:%S %Y GMT"),
                "Expiration Period":  f"{(na - nb).days} days",
                "Expiration D-Day":   f"{(na - now).days} days"
            }

    except Exception as e:
        # 디버깅용 stderr 출력
        print(f"[DEBUG] get_cert_info 예외: {e}", file=sys.stderr)

    # 파싱 실패 시
    return {
        "Certificate": cert_name,
        "Expiration date":    "N/A",
        "Expiration Period":  "N/A",
        "Expiration D-Day":   "N/A"
    }

def retrieve_cert(cert_name, cmd, host):
    """
    헬퍼 함수: 인증서 정보를 조회한 후 host 키를 추가하여 반환
    """
    info = get_cert_info(cert_name, cmd)
    info["Host"] = host
    return info

def get_local_ips():
    """
    hostname -i 명령을 실행하여 로컬 IP 주소 목록을 반환
    """
    ips = []
    try:
        result = subprocess.run(
            "hostname -i",
            shell=True,
            stdout=PIPE,                # 표준출력 캡처
            stderr=PIPE,                # 표준에러 캡처
            universal_newlines=True,
            timeout=5
        )
        if result.returncode == 0:
            # 공백으로 구분된 IP들을 분리하여 리스트로 반환
            ips = [ip.strip() for ip in result.stdout.strip().split()]
    except Exception:
        pass

    return ips

def get_certificate_data(connection):
    """
    엔진과 호스트들의 인증서를 병렬로 조회함
    모든 SSH 호출에 get_ssh_prefix()를 사용하여
    변경된 SSH 포트에 유연하게 대응하고,
    표시할 Host/Engine 이름은 실제 호스트명(FQDN)으로 보여줌
    """
    certs = []
    try:
        hosts = connection.system_service().hosts_service().list()
    except Exception:
        hosts = []

    # 엔진 FQDN은 설정에서 가져오거나 리버스 DNS로 조회
    fqdn = get_fqdn_from_config() or ""
    engine_name = fqdn
    # fallback: 리버스 DNS
    if not engine_name:
        ip = get_ip_from_hosts(fqdn)
        engine_name = get_engine_hostname(ip)

    tasks = []
    local_ips = get_local_ips()
    try:
        local_single = socket.gethostbyname(socket.gethostname()).strip()
        if local_single not in local_ips:
            local_ips.append(local_single)
    except Exception:
        pass
    if "127.0.0.1" not in local_ips:
        local_ips.append("127.0.0.1")

    with ThreadPoolExecutor() as executor:
        # 각 호스트의 VDSM 인증서
        for host in hosts:
            host_addr = host.address.strip()
            # 표시할 이름은 host.name
            display_name = host.name or host_addr

            if socket.gethostbyname(host_addr) in local_ips:
                cmd = "echo HOSTNAME: $(hostname); openssl x509 -noout -dates -in /etc/pki/vdsm/certs/vdsmcert.pem"
            else:
                ssh_opts = get_ssh_prefix()
                prefix = get_ssh_prefix()
                cmd = (
                    f"{prefix} ssh {ssh_opts} "
                    f"-o StrictHostKeyChecking=no -o BatchMode=yes "
                    f"rutilvm@{host_addr} "
                    f"'echo HOSTNAME: $(hostname); "
                    f"openssl x509 -noout -dates -in /etc/pki/vdsm/certs/vdsmcert.pem'"
                )
            tasks.append(executor.submit(retrieve_cert, "VDSM Certificate", cmd, display_name))

        # 엔진 측 인증서들 (표시 이름: engine_name)
        parsed = urlparse(connection.url)
        engine_addr = parsed.hostname
        ssh_opts = get_ssh_prefix()
        engine_cmds = [
            ("Engine Certificate",
             f"{SSH_PREFIX}ssh {ssh_opts} "
             f"-o StrictHostKeyChecking=no -o BatchMode=yes "
             f"rutilvm@{engine_addr} "
             f"'echo HOSTNAME: $(hostname); "
             f"openssl x509 -noout -dates -in /etc/pki/ovirt-engine/certs/websocket-proxy.cer'"),
            ("Engine CA Certificate",
             f"{SSH_PREFIX}ssh {ssh_opts} "
             f"-o StrictHostKeyChecking=no -o BatchMode=yes "
             f"rutilvm@{engine_addr} "
             f"'echo HOSTNAME: $(hostname); "
             f"openssl x509 -noout -dates -in /etc/pki/ovirt-engine/ca.pem'"),
            ("Engine Server Certificate",
             f"{SSH_PREFIX}ssh {ssh_opts} "
             f"-o StrictHostKeyChecking=no -o BatchMode=yes "
             f"rutilvm@{engine_addr} "
             f"'echo HOSTNAME: $(hostname); "
             f"openssl x509 -noout -dates -in /etc/pki/ovirt-engine/certs/engine.cer'")
        ]
        for name, cmd in engine_cmds:
            tasks.append(executor.submit(retrieve_cert, name, cmd, engine_name))

        for fut in as_completed(tasks):
            certs.append(fut.result())

    return certs

def show_certificates(stdscr, connection):
    """
    SSH 포트 매핑을 사용하되, 로컬 호스트는 로컬 openssl로 인증서 조회,
    각 호스트/엔진별로 SSH 포트 변경 감지 및 UI 표시
    """
    import os, subprocess, curses, textwrap, json, socket
    from urllib.parse import urlparse

    # 로컬 IP 목록
    def get_local_ips():
        ips = []
        try:
            res = subprocess.run("hostname -i", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
            if res.returncode == 0:
                ips = [ip for ip in res.stdout.split()]
        except:
            pass
        return ips
    local_ips = get_local_ips()

    # 포트 매핑 로드
    try:
        raw = json.loads(open(SSH_PORT_FILE).read())
        host_ports = raw if isinstance(raw, dict) else {}
    except Exception:
        host_ports = {}

    def get_port(host):
        return host_ports.get(host, load_ssh_port())

    # SSH 연결 테스트 (로컬은 패스)
    def ensure_ssh(host):
        if host in local_ips or host in (socket.gethostname(), '127.0.0.1'):
            return True
        port = get_port(host)
        ssh_opts = f"-p {port} {CONTROL_OPTS}"
        cmd = f"{SSH_PREFIX}ssh {ssh_opts} -o StrictHostKeyChecking=no -o BatchMode=yes rutilvm@{host} echo"
        res = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True, timeout=5)
        if res.returncode != 0:
            # 포트 입력 팝업 (ESC만 None 반환)
            new_port = prompt_ssh_port_popup(stdscr, host)
            if new_port is None:
                return False
            host_ports[host] = new_port
            with open(SSH_PORT_FILE, 'w') as f:
                json.dump(host_ports, f)
            # 재귀 호출로 새로운 포트로 다시 검사
            return ensure_ssh(host)
    
        return True

    # 대상 호스트 및 엔진
    parsed = urlparse(connection.url)
    engine_addr = parsed.hostname
    try:
        hosts = connection.system_service().hosts_service().list()
    except:
        hosts = []
    targets = [engine_addr] + [h.address.strip() for h in hosts]
    for t in targets:
        if not ensure_ssh(t):
            return

    # 인증서 조회 헬퍼
    def fetch_cmd(host, openssl_path):
        # 로컬일 경우 직접 openssl
        if host in local_ips or host in (socket.gethostname(), '127.0.0.1'):
            return f"echo HOSTNAME: $(hostname); openssl x509 -noout -dates -in {openssl_path}"
        # 원격일 경우 SSH
        port = get_port(host)
        ssh_opts = f"-p {port} {CONTROL_OPTS}"
        return (f"{SSH_PREFIX}ssh {ssh_opts} -o StrictHostKeyChecking=no -o BatchMode=yes "
                f"rutilvm@{host} 'echo HOSTNAME: $(hostname); openssl x509 -noout -dates -in {openssl_path}'")

    certs = []
    # VDSM 인증서
    for h in hosts:
        host_ip = h.address.strip()
        path = "/etc/pki/vdsm/certs/vdsmcert.pem"
        cmd = fetch_cmd(host_ip, path)
        certs.append(retrieve_cert("VDSM Certificate", cmd, h.name or host_ip))
    # 엔진 인증서
    fqdn = get_fqdn_from_config() or engine_addr
    paths = [("Engine Certificate", "/etc/pki/ovirt-engine/certs/websocket-proxy.cer"),
             ("Engine CA Certificate", "/etc/pki/ovirt-engine/ca.pem"),
             ("Engine Server Certificate", "/etc/pki/ovirt-engine/certs/engine.cer")]
    for label, p in paths:
        cmd = fetch_cmd(engine_addr, p)
        certs.append(retrieve_cert(label, cmd, fqdn))

    certs.sort(key=lambda c: c.get("Host",""))

    # UI 표시
    curses.curs_set(0)
    stdscr.nodelay(0)
    max_rows, col_widths = 22, [26,27,26,18,18]
    total_pages = max(1,(len(certs)+max_rows-1)//max_rows)
    current_page = 0
    policy_text = (
        "RutilVM automatically requires the renewal of certificates that are set to expire within 30 days. "
        "If the engine-setup command is executed within 30 days before the expiration date, the PKI CONFIGURATION stage will be activated. "
        "If more than 30 days remain before the expiration date, the PKI stage will be skipped when running the engine-setup command. "
        "oVirt checks the expiration date of both the existing CA certificate and the server certificate. "
        "If either certificate is set to expire within 30 days, renewal is required. "
        "Failure to renew the certificates may result in the inability to access the web interface and disruption of certain services, so it is crucial to renew them in advance."
    )
    policy_lines = textwrap.wrap(policy_text, width=min(119, curses.COLS-4))

    while True:
        stdscr.erase()
        hgt, wid = stdscr.getmaxyx()
        stdscr.addstr(1,1,"■ Certificate",curses.A_BOLD)
        stdscr.addstr(3,1,"- Certificate List")
        if total_pages>1:
            pstr=f"{current_page+1}/{total_pages}"; stdscr.addstr(3,wid-len(pstr)-1,pstr)
        y0=6
        stdscr.addstr(y0-2,1,"┌"+"┬".join("─"*w for w in col_widths)+"┐")
        hdrs=["Host Name","Certificate","Expiration date","Expiration Period","Expiration D-Day"]
        stdscr.addstr(y0-1,1,"│"+"│".join(h.ljust(col_widths[i]) for i,h in enumerate(hdrs))+"│")
        stdscr.addstr(y0,1,"├"+"┼".join("─"*w for w in col_widths)+"┤")
        for idx,c in enumerate(certs[current_page*max_rows:(current_page+1)*max_rows]):
            row ="│"+"│".join(str(c.get(k,"-")).ljust(col_widths[i]) for i,k in enumerate(["Host","Certificate","Expiration date","Expiration Period","Expiration D-Day"]))+"│"
            stdscr.addstr(y0+1+idx,1,row)
        by=y0+1+min(len(certs)-current_page*max_rows,max_rows)
        stdscr.addstr(by,1,"└"+"┴".join("─"*w for w in col_widths)+"┘")
        box_y=by+2; box_w=min(119,wid-4)
        stdscr.addstr(box_y,1,"- Certificate Renewal Policy")
        stdscr.addstr(box_y+1,1,"┌"+"─"*box_w+"┐")
        for i,pl in enumerate(policy_lines): stdscr.addstr(box_y+2+i,1,"│"+pl.ljust(box_w)+"│")
        stdscr.addstr(box_y+2+len(policy_lines),1,"└"+"─"*box_w+"┘")
        footer="ESC=Go back | Q=Quit"
        if total_pages>1: footer+=" "*(wid-len(footer)-10)+"N=Next | P=Prev"
        stdscr.addstr(hgt-1,1,footer)
        stdscr.refresh()
        k=stdscr.getch()
        if k in (27,ord('q'),ord('Q')): break
        if k in (ord('n'),ord('N')) and current_page<total_pages-1: current_page+=1
        if k in (ord('p'),ord('P')) and current_page>0: current_page-=1

# =============================================================================
# Section 13: Evnets Section
# =============================================================================
def show_no_events_popup(stdscr, message="No events found."):
    """
    'No events found.' 등의 메시지를 팝업 창으로 표시함
    아무 키나 누르면 팝업만 닫고 반환함
    """
    curses.flushinp()  # 입력 버퍼 비우기
    height, width = stdscr.getmaxyx()  # 터미널 창 크기 가져오기
    popup_height = 7
    popup_width = 50
    popup_y = (height - popup_height) // 2
    popup_x = (width - popup_width) // 2

    popup = curses.newwin(popup_height, popup_width, popup_y, popup_x)
    popup.keypad(True)
    popup.timeout(-1)  # 블로킹 모드로 설정
    popup.border()

    popup.addstr(2, (popup_width - len(message)) // 2, message, curses.A_BOLD)
    footer = "Press any key to continue"
    popup.addstr(4, (popup_width - len(footer)) // 2, footer, curses.A_DIM)
    popup.refresh()

    popup.getch()
    curses.flushinp()

    popup.clear()
    popup.refresh()
    del popup

def fetch_events(connection, result):
    """
    별도 스레드에서 이벤트 목록을 가져와서 result 딕셔너리에 저장함
    """
    try:
        events_service = connection.system_service().events_service()
        events = events_service.list()
        # 기본적으로 최근 이벤트가 먼저 보이도록 내림차순 정렬함
        events.sort(key=lambda ev: ev.time if ev.time else datetime.datetime.min, reverse=True)
        result['events'] = events
    except Exception as e:
        result['events_error'] = str(e)

def fetch_stats(connection, result):
    """
    (예시) 별도 스레드에서 통계 데이터를 수집하여 result 딕셔너리에 저장함
    실제 API에 맞게 구현 필요
    """
    try:
        stats_service = connection.system_service().stats_service()
        stats = stats_service.get_stats()
        result['stats'] = stats
    except Exception as e:
        result['stats_error'] = str(e)

def show_event_detail(stdscr, event):
    """
    선택한 이벤트의 상세 정보를 고정 폭(121 칸) 박스로 보여주며,
    헤더 "- Event Detail"은 터미널의 두 번째 줄에 표시하고,
    마지막 줄에는 "ESC=Go back | Q=Quit" 네비게이션 문구를 출력함
    """
    stdscr.nodelay(False)
    curses.flushinp()
    stdscr.clear()
    height, width = stdscr.getmaxyx()

    BOX_WIDTH = 121
    inner_width = BOX_WIDTH - 2

    if width < BOX_WIDTH:
        stdscr.addstr(0, 0, f"Terminal width must be at least {BOX_WIDTH} columns.")
        stdscr.refresh()
        stdscr.getch()
        return

    box_left = 1
    box_top = 2

    event_time = event.time.strftime('%Y-%m-%d %H:%M:%S') if event.time else "-"
    severity = getattr(event.severity, 'name', str(event.severity)) if event.severity else "-"
    description = event.description if event.description else "-"

    content_lines = []
    content_lines.append(f"Time: {event_time}")
    content_lines.append(f"Severity: {severity}")
    content_lines.append("Description:")
    wrapped_description = textwrap.wrap(description, width=inner_width)
    content_lines.extend(wrapped_description)

    stdscr.addstr(1, 1, "- Event Detail")
    top_border = "┌" + "─" * inner_width + "┐"
    stdscr.addstr(box_top, box_left, top_border)

    for i, line in enumerate(content_lines):
        padded_line = line.ljust(inner_width)
        stdscr.addstr(box_top + 1 + i, box_left, "│" + padded_line + "│")

    bottom_border = "└" + "─" * inner_width + "┘"
    stdscr.addstr(box_top + 1 + len(content_lines), box_left, bottom_border)

    nav_text = " ESC=Go back | Q=Quit"
    stdscr.addstr(height - 1, 0, nav_text)

    stdscr.refresh()

    while True:
        key = stdscr.getch()
        if key == 27:  # ESC
            break
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)

def show_events(stdscr, connection):
    """
    이벤트 화면:
      - 검색, 필터, 페이지 네비게이션 등 기능을 포함한 이벤트 목록 표시
      - 초기 로딩 및 'R=Refresh' 시 API 호출과 통계 수집을 병렬 처리하여 속도 개선
    """
    import threading, time

    stdscr.erase()
    stdscr.nodelay(True)  # 비블로킹 모드 (스피너 효과)
    spinner_chars = ['|', '/', '-', '\\']
    spinner_index = 0

    # 초기 로딩: 이벤트와 통계 데이터를 동시에 가져옴
    result = {}
    events_thread = threading.Thread(target=fetch_events, args=(connection, result))
    stats_thread = threading.Thread(target=fetch_stats, args=(connection, result))
    events_thread.start()
    stats_thread.start()
    while events_thread.is_alive() or stats_thread.is_alive():
        stdscr.erase()
        stdscr.addstr(1, 1, f"Loading events... {spinner_chars[spinner_index]}", curses.A_NORMAL)
        stdscr.refresh()
        spinner_index = (spinner_index + 1) % len(spinner_chars)
        time.sleep(0.1)
    events_thread.join()
    stats_thread.join()
    stdscr.nodelay(False)

    if 'events_error' in result:
        stdscr.erase()
        stdscr.addstr(1, 1, f"Failed to fetch Events: {result['events_error']}")
        stdscr.refresh()
        stdscr.getch()
        return
    if 'stats_error' in result:
        stats = None
    else:
        stats = result.get('stats')
    events = result.get('events', [])

    # --- 색상 모드 초기화:  init_curses_colors()를 호출하여 색상 페어를 정의함
    init_curses_colors()
    # --------------------------------------------------
    search_query = ""
    pending_search = ""
    severity_filter = ""
    # severity 필터의 정렬 순서를 저장할 변수 (WARNING/EERROR 필터가 적용될 때만 사용)
    severity_sort_order = None  
    current_focus = "table"
    selected_row = 0
    current_page = 0

    # 전역 시간 정렬 순서 변수 (T키용): 기본은 내림차순
    sort_order = "desc"

    # 마지막 필터/정렬 상태를 추적 (상태 변화가 있을 때에만 필터링을 다시 적용)
    last_filter_query = None
    last_severity_filter = None
    last_severity_sort_order = None

    curses.curs_set(0)
    stdscr.clear()

    search_left_width = 7
    search_right_width = 111
    table_col1_width = 19
    table_col2_width = 9
    table_col3_width = 89
    table_total_width = 1
    rows_per_page = 32
    min_height = 4 + rows_per_page + 4

    search_box_top = 4
    search_top_border = "┌" + "─" * search_left_width + "┬" + "─" * search_right_width + "┐"
    search_bottom_border = "└" + "─" * search_left_width + "┴" + "─" * search_right_width + "┘"

    while True:
        # 현재 터미널 크기 가져오기
        height, width = stdscr.getmaxyx()

        # 터미널 크기가 최소 요구치보다 작으면 사용자에게 리사이즈 요청 메시지 표시
        if height < min_height or width < table_total_width + 1:
            stdscr.erase()  # 화면 초기화
            stdscr.addstr(0, 0,
                          f"Resize terminal to at least {table_total_width+1}x{min_height}.",
                          curses.A_NORMAL)
            stdscr.refresh()  # 출력 반영
            continue  # 다음 루프 반복

        # 현재 포커스가 검색창일 경우
        if current_focus == "search":
            # 검색창 상단 테두리 출력
            stdscr.addstr(search_box_top, 1, search_top_border)

            # 검색창 왼쪽 셀 (라벨) 채우기
            left_cell = "Search".ljust(search_left_width)

            # 오른쪽 입력칸에 표시될 검색어: 너비 초과 시 오른쪽 끝만 보여줌
            displayed_query = pending_search[-search_right_width:]

            # 오른쪽 셀 문자열 조정
            right_cell = displayed_query.ljust(search_right_width)

            # 최종적으로 화면에 그릴 검색창 한 줄
            search_input_line = "│" + left_cell + "│" + right_cell + "│"

            # 입력창 본문 출력
            stdscr.addstr(search_box_top + 1, 1, search_input_line)

            # 하단 테두리 출력
            stdscr.addstr(search_box_top + 2, 1, search_bottom_border)

            # 커서 위치 계산 (검색어의 길이 기준으로 우측에 위치)
            cursor_x = 2 + 1 + search_left_width + 1 + min(len(pending_search), search_right_width) - 1
            curses.curs_set(1)  # 커서 표시
            stdscr.move(search_box_top + 1, cursor_x)  # 커서 이동
            stdscr.refresh()  # 갱신

            # 키 입력 대기
            key = stdscr.getch()

            # TAB 또는 Shift+TAB: 테이블로 포커스 이동
            if key in (9, curses.KEY_BTAB):
                current_focus = "table"

            # ESC: 테이블로 포커스 이동
            elif key == 27:
                current_focus = "table"

            # 백스페이스: 검색어에서 마지막 문자 삭제
            elif key in (curses.KEY_BACKSPACE, 127, 8):
                pending_search = pending_search[:-1]

            # Enter: 검색 실행
            elif key == 10:
                temp_filtered = events  # 전체 이벤트에서 시작
                # 검색어가 존재하는 경우
                if pending_search:
                    sq = pending_search.lower()  # 소문자로 변환한 검색어
                    temp_filtered = [
                        ev for ev in temp_filtered
                        if ((ev.description and sq in ev.description.lower())
                            or (ev.severity and sq in getattr(ev.severity, 'name', str(ev.severity)).lower())
                            or (ev.time and sq in ev.time.strftime('%Y-%m-%d %H:%M:%S')))
                    ]
                # 심각도 필터가 설정된 경우 추가 필터링
                if severity_filter:
                    temp_filtered = [
                        ev for ev in temp_filtered
                        if (ev.severity and severity_filter == getattr(ev.severity, 'name', str(ev.severity)).upper())
                    ]
                # 결과가 없는 경우: 알림 팝업 출력 후 테이블로 포커스 이동
                if not temp_filtered:
                    show_no_events_popup(stdscr, "No events found.")
                    current_focus = "table"
                else:
                    # 검색 결과 저장 및 초기화
                    search_query = pending_search
                    current_page = 0
                    selected_row = 0
                    current_focus = "table"
            # 일반적인 문자 입력 처리 (ASCII printable 문자만 허용)
            elif key != -1 and 32 <= key <= 126:
                pending_search += chr(key)
            # 검색 모드에서는 continue하여 테이블 출력 생략
            continue

         # 필터링 또는 정렬 조건이 변경되었는지 확인
        if (last_filter_query != search_query or 
            last_severity_filter != severity_filter or 
            last_severity_sort_order != severity_sort_order):
            
            temp = events  # 전체 이벤트 목록을 복사하여 시작

            # 검색어가 있을 경우 필터링
            if search_query:
                sq = search_query.lower()
                temp = [
                    ev for ev in temp
                    if ((ev.description and sq in ev.description.lower())  # 설명에 검색어 포함
                        or (ev.severity and sq in getattr(ev.severity, 'name', str(ev.severity)).lower())  # 심각도 포함
                        or (ev.time and sq in ev.time.strftime('%Y-%m-%d %H:%M:%S')))  # 시간 문자열 포함
                ]

            # severity 필터가 설정되어 있을 경우 추가 필터링
            if severity_filter:
                temp = [
                    ev for ev in temp
                    if (ev.severity and severity_filter == getattr(ev.severity, 'name', str(ev.severity)).upper())
                ]
                # severity 필터가 있을 경우, 정렬 순서도 적용 (기본: 내림차순)
                order = severity_sort_order if severity_sort_order is not None else "desc"
                temp.sort(
                    key=lambda ev: ev.time if ev.time else datetime.datetime.min,
                    reverse=(order == "desc")
                )

            # 필터링 및 정렬 결과를 캐시에 저장
            cached_filtered_events = temp
            last_filter_query = search_query
            last_severity_filter = severity_filter
            last_severity_sort_order = severity_sort_order

        # 최종 필터링된 이벤트 목록을 사용
        filtered_events = cached_filtered_events

        # 화면 초기화
        stdscr.erase()

        # 상단 제목 표시
        stdscr.addstr(1, 1, "■ Events", curses.A_BOLD)

        # 검색창 렌더링
        stdscr.addstr(search_box_top, 1, search_top_border)
        left_cell = "Search".ljust(search_left_width)
        displayed_query = pending_search[-search_right_width:]
        right_cell = displayed_query.ljust(search_right_width)
        search_input_line = "│" + left_cell + "│" + right_cell + "│"
        stdscr.addstr(search_box_top + 1, 1, search_input_line)
        stdscr.addstr(search_box_top + 2, 1, search_bottom_border)

        # 페이지 수 계산
        total_pages = max(1, (len(filtered_events) + rows_per_page - 1) // rows_per_page)

        # 이벤트 목록 헤더 표시
        header_text = "- Event List"
        stdscr.addstr(3, 1, header_text)

        # 페이지 정보 우측 상단에 표시
        if total_pages > 1:
            page_info_text = f"{current_page+1}/{total_pages}"
            page_info_width = sum(
                2 if unicodedata.east_asian_width(c) in ('F', 'W') else 1
                for c in page_info_text
            )
            x_page_info = 121 - page_info_width + 1
            stdscr.addstr(3, x_page_info, page_info_text)

        # 테이블 상단 경계선
        table_top_border = (
            "┌" + "─" * table_col1_width +
            "┬" + "─" * table_col2_width +
            "┬" + "─" * table_col3_width + "┐"
        )

        header_row = search_box_top + 3

        # 헤더 라인 구성 (각 열 제목)
        table_header_line = (
            "│" + get_display_width("Time", table_col1_width) +
            "│" + get_display_width("Severity", table_col2_width) +
            "│" + get_display_width("Description", table_col3_width) + "│"
        )

        # 이벤트가 없을 경우, 분리선을 다르게 표시 (세로선 X, 수평선만)
        if len(filtered_events) == 0:
            divider_row_used = (
                "├" + "─" * table_col1_width +
                "┴" + "─" * table_col2_width +
                "┴" + "─" * table_col3_width + "┤"
            )
        else:
            divider_row_used = (
                "├" + "─" * table_col1_width +
                "┼" + "─" * table_col2_width +
                "┼" + "─" * table_col3_width + "┤"
            )

        # 테이블 테두리 및 헤더 출력
        stdscr.addstr(header_row, 1, table_top_border)
        stdscr.addstr(header_row + 1, 1, table_header_line)
        stdscr.addstr(header_row + 2, 1, divider_row_used)

        table_data_start = header_row + 3

        # 현재 페이지가 범위를 벗어났다면 조정
        if current_page >= total_pages:
            current_page = max(0, total_pages - 1)
            selected_row = 0

        # 이벤트가 하나도 없을 경우: 빈 행 표시
        if len(filtered_events) == 0:
            full_width = table_total_width - 2  # 좌우 테두리 제외한 총 너비
            message = "  No events found."
            row_text = "│" + message.ljust(full_width) + "│"
            stdscr.addstr(table_data_start, 1, row_text)

            # 남은 행도 빈 공간으로 출력
            for i in range(1, rows_per_page):
                blank_text = "│" + " " * full_width + "│"
                stdscr.addstr(table_data_start + i, 1, blank_text)
        else:
            # 페이지 범위에 해당하는 이벤트만 선택
            start_idx = current_page * rows_per_page
            end_idx = start_idx + rows_per_page
            current_page_events = filtered_events[start_idx:end_idx]

            # 각 행 출력
            for i in range(rows_per_page):
                row_y = table_data_start + i

                # 유효한 이벤트가 있는 경우
                if i < len(current_page_events):
                    event = current_page_events[i]

                    # 시간, 심각도, 설명 문자열 포맷 처리
                    event_time_str = event.time.strftime('%Y-%m-%d %H:%M:%S') if event.time else "-"
                    sev_str = getattr(event.severity, 'name', str(event.severity)) if event.severity else "-"
                    description_str = event.description.replace("\n", " ") if event.description else "-"

                    # 폭 제한 적용 (문자 너비 계산 포함)
                    event_time_str = get_display_width(event_time_str, table_col1_width)
                    sev_str = get_display_width(sev_str, table_col2_width)
                    description_str = get_display_width(description_str, table_col3_width)

                    # 테이블 한 줄 구성
                    row_text = (
                        "│" + event_time_str +
                        "│" + sev_str +
                        "│" + description_str + "│"
                    )
                else:
                    # 빈 줄 처리
                    row_text = (
                        "│" + " " * table_col1_width +
                        "│" + " " * table_col2_width +
                        "│" + " " * table_col3_width + "│"
                    )

                # 선택된 행이면 강조 색상 적용
                if current_focus == "table" and i == selected_row:
                    stdscr.attron(curses.color_pair(1))
                    stdscr.addstr(row_y, 1, row_text)
                    stdscr.attroff(curses.color_pair(1))
                else:
                    stdscr.addstr(row_y, 1, row_text)

        # 테이블 하단 테두리 출력
        table_bottom_row = table_data_start + rows_per_page
        table_bottom_border = (
            "└" + "─" * table_col1_width +
            "┴" + "─" * table_col2_width +
            "┴" + "─" * table_col3_width + "┘"
        )
        stdscr.addstr(table_bottom_row, 1, table_bottom_border)

        # 내비게이션 문구 수정: 오른쪽 "N=Next | P=Prev"의 끝이 항상 123번째 칸에 고정되도록 함
        nav_left = "TAB=Switch focus | T=Time | W=WARNING | E=ERROR | A=ALERT | R=Refresh | ESC=Go back | Q=Quit  "
        nav_right = "N=Next | P=Prev"
        nav_row = height - 1
        
        # nav_left는 화면 왼쪽에 출력 (시작 열 1)
        stdscr.addstr(nav_row, 1, nav_left, curses.A_NORMAL)
        # nav_right의 마지막 문자가 121번째 칸에 위치하도록 시작 열을 계산 (1-indexed)
        start_col = 121 - len(nav_right) + 1
        stdscr.addstr(nav_row, start_col, nav_right, curses.A_NORMAL)

        curses.curs_set(0)
        stdscr.move(height - 1, width - 1)
        stdscr.refresh()

        key = stdscr.getch()
        if key == 9:
            current_focus = "search"
            pending_search = search_query
        elif key == curses.KEY_UP:
            if filtered_events:
                global_index = current_page * rows_per_page + selected_row
                new_index = (global_index - 1) % len(filtered_events)
                current_page = new_index // rows_per_page
                selected_row = new_index % rows_per_page
        elif key == curses.KEY_DOWN:
            if filtered_events:
                global_index = current_page * rows_per_page + selected_row
                new_index = (global_index + 1) % len(filtered_events)
                current_page = new_index // rows_per_page
                selected_row = new_index % rows_per_page
        elif key in (ord('n'), ord('N')):
            if current_page < total_pages - 1:
                current_page += 1
                selected_row = 0
        elif key in (ord('p'), ord('P')):
            if current_page > 0:
                current_page -= 1
                selected_row = 0
        # W키 처리: WARNING 필터
        elif key in (ord('w'), ord('W')):
            if severity_filter == "WARNING":
                # 이미 WARNING 필터가 적용되어 있다면 정렬 순서를 토글
                severity_sort_order = "asc" if severity_sort_order == "desc" else "desc"
            else:
                severity_filter = "WARNING"
                severity_sort_order = "desc"
            temp_filtered = [ev for ev in events if (ev.severity and "WARNING" == getattr(ev.severity, 'name', str(ev.severity)).upper())]
            if search_query:
                sq = search_query.lower()
                temp_filtered = [ev for ev in temp_filtered if ((ev.description and sq in ev.description.lower())
                                                                or (ev.time and sq in ev.time.strftime('%Y-%m-%d %H:%M:%S')))]
            if not temp_filtered:
                show_no_events_popup(stdscr, "No WARNING events found.")
                severity_filter = ""
                severity_sort_order = None
            else:
                current_page = 0
                selected_row = 0
        # E키 처리: ERROR 필터
        elif key in (ord('e'), ord('E')):
            if severity_filter == "ERROR":
                severity_sort_order = "asc" if severity_sort_order == "desc" else "desc"
            else:
                severity_filter = "ERROR"
                severity_sort_order = "desc"
            temp_filtered = [ev for ev in events if (ev.severity and "ERROR" == getattr(ev.severity, 'name', str(ev.severity)).upper())]
            if search_query:
                sq = search_query.lower()
                temp_filtered = [ev for ev in temp_filtered if ((ev.description and sq in ev.description.lower())
                                                                or (ev.time and sq in ev.time.strftime('%Y-%m-%d %H:%M:%S')))]
            if not temp_filtered:
                show_no_events_popup(stdscr, "No ERROR events found.")
                severity_filter = ""
                severity_sort_order = None
            else:
                current_page = 0
                selected_row = 0
        elif key in (ord('r'), ord('R')):
            stdscr.nodelay(True)
            spinner_index = 0
            result = {}
            events_thread = threading.Thread(target=fetch_events, args=(connection, result))
            stats_thread = threading.Thread(target=fetch_stats, args=(connection, result))
            events_thread.start()
            stats_thread.start()
            while events_thread.is_alive() or stats_thread.is_alive():
                stdscr.erase()
                stdscr.addstr(1, 1, f"Loading data... {spinner_chars[spinner_index]}", curses.A_NORMAL)
                stdscr.refresh()
                spinner_index = (spinner_index + 1) % len(spinner_chars)
                time.sleep(0.1)
            events_thread.join()
            stats_thread.join()
            stdscr.nodelay(False)
            if 'events_error' in result:
                stdscr.erase()
                stdscr.addstr(1, 1, f"Failed to fetch Events: {result['events_error']}")
                stdscr.refresh()
                stdscr.getch()
            else:
                events = result.get('events', [])
                # 필터와 정렬 상태 초기화
                search_query = ""
                pending_search = ""
                severity_filter = ""
                severity_sort_order = None
                current_page = 0
                selected_row = 0
        elif key == 10:
            if len(filtered_events) != 0:
                start_idx = current_page * rows_per_page
                current_page_events = filtered_events[start_idx:start_idx + rows_per_page]
                if 0 <= selected_row < len(current_page_events):
                    selected_event = current_page_events[selected_row]
                    show_event_detail(stdscr, selected_event)
        elif key in (ord('q'), ord('Q')):
            sys.exit(0)
        elif key in (ord('t'), ord('T')):
            if severity_filter:  
                # 필터가 적용된 경우: severity_sort_order를 토글하여 필터된 이벤트들의 시간 정렬 순서를 변경함
                severity_sort_order = "asc" if severity_sort_order == "desc" else "desc"
                current_page = 0
                selected_row = 0
            else:
                # 필터가 없으면 전역 정렬 순서를 토글하고, events 리스트 자체를 정렬함
                sort_order = "asc" if sort_order == "desc" else "desc"
                events.sort(key=lambda ev: ev.time if ev.time else datetime.datetime.min, reverse=(sort_order == "desc"))
                current_page = 0
                selected_row = 0
        # A키 처리: ALERT 필터
        elif key in (ord('a'), ord('A')):
            if severity_filter == "ALERT":
                # 이미 ALERT 필터가 적용되어 있다면 정렬 순서를 토글
                severity_sort_order = "asc" if severity_sort_order == "desc" else "desc"
            else:
                severity_filter = "ALERT"
                severity_sort_order = "desc"
            temp_filtered = [
                ev for ev in events
                if (ev.severity and "ALERT" == getattr(ev.severity, 'name', str(ev.severity)).upper())
            ]
            if search_query:
                sq = search_query.lower()
                temp_filtered = [
                    ev for ev in temp_filtered
                    if ((ev.description and sq in ev.description.lower())
                        or (ev.time and sq in ev.time.strftime('%Y-%m-%d %H:%M:%S')))
                ]
            if not temp_filtered:
                show_no_events_popup(stdscr, "No ALERT events found.")
                severity_filter = ""
                severity_sort_order = None
            else:
                current_page = 0
                selected_row = 0
        elif key == 27:
            break

# =============================================================================
# Section 14: Main Execution Block
# =============================================================================
# 1) UI 매핑
ui_map = {
    "--vm":          show_virtual_machines,
    "--datacenter":  show_data_centers,
    "--cluster":     show_clusters,
    "--host":        show_hosts,
    "--network":     show_networks,
    "--storage":     show_storage_domains,
    "--disk":        show_storage_disks,
    "--user":        show_users,
    "--certificate": show_certificates,
    "--event":       show_events,
}

# 2) 단일 CLI 명령 매핑
SINGLE_CMD = {
    "--engine-cleanup":         ["ovirt-hosted-engine-cleanup"],
    "--vm-status":              ["hosted-engine", "--vm-status"],
    "--vm-start":               ["hosted-engine", "--vm-start"],
    "--vm-start-paused":        ["hosted-engine", "--vm-start-paused"],
    "--vm-shutdown":            ["hosted-engine", "--vm-shutdown"],
    "--vm-poweroff":            ["hosted-engine", "--vm-poweroff"],
    "--check-deployed":         ["hosted-engine", "--check-deployed"],
    "--check-liveliness":       ["hosted-engine", "--check-liveliness"],
    "--connect-storage":        ["hosted-engine", "--connect-storage"],
    "--disconnect-storage":     ["hosted-engine", "--disconnect-storage"],
    "--set-maintenance --mode=global": ["hosted-engine", "--set-maintenance", "--mode=global"],
    "--set-maintenance --mode=local":  ["hosted-engine", "--set-maintenance", "--mode=local"],
    "--set-maintenance --mode=none":   ["hosted-engine", "--set-maintenance", "--mode=none"],
    "--reinitialize-lockspace": ["hosted-engine", "--reinitialize-lockspace"],
    "--clean-metadata":         ["hosted-engine", "--clean-metadata"],
}

# 3) 인자 파싱 및 --help
args = sys.argv[1:]
# help 요청 시
if "--help" in args:
    print_help()
    sys.exit(0)

# 4) 첫 번째 인자(opt) 정의 (없으면 None)
opt = args[0] if args else None

# 5) 허용된 옵션 집합 정의
valid_ui     = set(ui_map.keys())      # --vm, --datacenter, ...
valid_single = set(SINGLE_CMD.keys())  # --vm-status, --vm-start, ...
deploy_flags = {"--host", "--engine", "--all", "--standard", "--key"}

# 6) 옵션 검증
# no-arg(opt is None)인 경우 메인 메뉴로 직행
if opt == "--deploy":
    # --deploy 뒤에는 반드시 deploy_flags 중 하나만
    for flag in args[1:]:
        if flag not in deploy_flags:
            print_help()
            sys.exit(1)
elif opt in valid_ui or opt in valid_single:
    # 단일 명령 뒤 추가 인자 있으면 오류
    if len(args) > 1:
        print_help()
        sys.exit(1)
elif opt is not None:
    # invalid 옵션
    print_help()
    sys.exit(1)

# 7) --deploy 처리
if "--deploy" in args:
    allowed = {"--deploy", "--host", "--engine", "--all", "--standard", "--key"}
    for a in args:
        if a not in allowed:
            print_help()
            sys.exit(0)
    # =============================================================================
    # --deploy --host 옵션 처리
    # =============================================================================
    if "--host" in args:
        shell_script = r"""
#!/bin/bash

# RutilVM 4.5.5 Node 설정용 스크립트 (CentOS Stream 8 기반)

set -e                         # 오류 발생 시 스크립트 중단. set -e 무시 옵션 : || true
set -o pipefail                # 파이프라인 에러 감지
stty erase ^H                  # 터미널에서 백스페이스 키 설정
export LANG=C                  # 시스템 언어 설정
export NMCLI_NOPROGRESS=1      # nmcli 진행 메시지 비활성화

# ───────────────────────────────────────────────────────────────────
# 1) 스크립트 시작 시 콘솔 로그 레벨을 낮추어 Bonding 관련 커널 메시지 숨김
old_loglevel=$(cat /proc/sys/kernel/printk)
# 숫자 2는 기본값이며, 필요시 3(에러 이상)나 4(경고 이상)로 설정 가능
echo 2 > /proc/sys/kernel/printk
# ───────────────────────────────────────────────────────────────────

# kickstart 설치 정보 파일 삭제 
# 대상 목록
FILES=(
    "/root/anaconda-ks.cfg"
    "/root/original-ks.cfg"
)

# 파일 존재 시 삭제
for file in "${FILES[@]}"; do
    [ -f "$file" ] && rm -f "$file"
done

task_libvirted_enable() {
# [BUG 처리] Failed to connect socket to '/var/run/libvirt/virtnetworkd-sock': No such file or directory 해결
systemctl enable libvirtd 2>/dev/null || true
systemctl start libvirtd 2>/dev/null || true
systemctl enable --now virtnetworkd.socket virtnetworkd 2>/dev/null || true
systemctl enable --now virtqemud.socket virtqemud 2>/dev/null || true
systemctl enable --now libvirtd.socket libvirtd 2>/dev/null || true
systemctl restart libvirtd virtqemud 2>/dev/null || true
}

# IP 주소 형식 검증 함수
# 입력받은 IP 주소가 0~255 범위의 4개 옥텟 형식에 맞는지 검사
valid_ip() {
    local ip=$1
    local regex='^((25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])$'
    if [[ $ip =~ $regex ]]; then
        return 0    # 유효한 IP
    else
        return 1    # 유효하지 않은 IP
    fi
}

# 호스트 등록 및 /etc/hosts 파일 업데이트 함수
task_host_add() {
    echo "- Hostname/Host Member Configuration"
    # 사용자가 설정할 호스트 수 입력받기 (최소 1 이상의 값)
    while true; do
        read -p "> Number of hosts to configure: " host_count
        if [[ "$host_count" =~ ^[1-9][0-9]*$ ]]; then
            break
        else
            echo "[WARNING] Incorrect input. Enter a number 1 or higher."
        fi
    done

    declare -a hostnames     # 호스트명 배열
    declare -a ips           # IP 주소 배열

    # 첫 번째 호스트 정보 입력 (현재 호스트)
    read -p "> Hostname of the current host: " first_hostname
    # 이미 등록된 호스트명일 경우 확인 후 덮어쓰기 여부 판단
    if [ "$first_hostname" = "$(hostname)" ] || grep -qE '(^|[[:space:]])'"$first_hostname"'([[:space:]]|$)' /etc/hosts; then
        read -p "  Hostname '$first_hostname' is already registered. Overwrite? (y/n): " answer
        answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
        if [[ "$answer" != "y" && "$answer" != "yes" ]]; then
            echo "Installation aborted."
            exit 1
        else
            sed -i -E '/(^|[[:space:]])'"$first_hostname"'([[:space:]]|$)/d' /etc/hosts
        fi
    fi

    # 현재 호스트명이 아니면 hostnamectl로 변경
    if [ "$first_hostname" != "$(hostname)" ]; then
        hostnamectl set-hostname "$first_hostname"
        echo "[ INFO  ] Hostname changed to '$first_hostname'"
    fi

    # 첫 번째 호스트의 IP 주소 입력 및 형식 검증
    while true; do
        read -p "> IP address for $first_hostname: " first_ip
        if valid_ip "$first_ip"; then
            break
        else
            echo "[WARNING] Invalid IP address format. Enter a valid IP address."
        fi
    done

    # IP 주소가 이미 등록되어 있는지 확인, 덮어쓰기 여부 선택
    if ip -br a | grep -o -E '([0-9]{1,3}\.){3}[0-9]{1,3}' | grep -Fxq "$first_ip" || \
       grep -qE '(^|[[:space:]])'"$first_ip"'([[:space:]]|$)' /etc/hosts; then
        read -p "  IP address '$first_ip' is already registered. Overwrite? (y/n): " answer
        answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
        if [[ "$answer" != "y" && "$answer" != "yes" ]]; then
            echo "Installation aborted."
            exit 1
        else
            sed -i -E '/(^|[[:space:]])'"$first_ip"'([[:space:]]|$)/d' /etc/hosts
        fi
    fi

    # 첫 번째 호스트 정보 배열에 저장
    hostnames[0]="$first_hostname"
    ips[0]="$first_ip"
    # 첫 번째 IP의 앞부분(예: 192.168.1)을 추출하여 기본 IP 접두어로 사용
    ip_prefix=$(echo "$first_ip" | awk -F'.' '{print $1"."$2"."$3}')

    # 추가 호스트 정보를 입력받기 (입력받은 호스트 수 만큼 반복)
    for (( i=2; i<=host_count; i++ )); do
        while true; do
            read -p "> Hostname of the additional host: " hostname
            # 이미 등록된 호스트명인지 확인 후 덮어쓰기 여부 선택
            if [[ " ${hostnames[*]} " =~ (^|[[:space:]])"$hostname"($|[[:space:]]) ]] || \
               [ "$hostname" = "$(hostname)" ] || \
               grep -qE '(^|[[:space:]])'"$hostname"'([[:space:]]|$)' /etc/hosts; then
                read -p "  Hostname '$hostname' is already registered. Overwrite? (y/n): " answer
                answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
                if [[ "$answer" != "y" && "$answer" != "yes" ]]; then
                    echo "Installation aborted."
                    exit 1
                else
                    sed -i -E '/(^|[[:space:]])'"$hostname"'([[:space:]]|$)/d' /etc/hosts
                fi
            fi
            if [ -n "$hostname" ]; then
                break
            fi
        done
        hostnames[i-1]="$hostname"

        # 각 호스트에 대해 IP 주소 입력 (기본 접두어 제공)
        while true; do
            read -e -i "$ip_prefix." -p "> IP address for $hostname: " ip_address
            if valid_ip "$ip_address"; then
                break
            else
                echo "[WARNING] Invalid IP address. Enter a valid IP address."
            fi
        done

        # 입력받은 IP 주소가 이미 사용 중이면 덮어쓰기 여부 선택
        if [[ " ${ips[*]} " =~ (^|[[:space:]])"$ip_address"($|[[:space:]]) ]] || \
           ip -br a | grep -o -E '([0-9]{1,3}\.){3}[0-9]{1,3}' | grep -Fxq "$ip_address" || \
           grep -qE '(^|[[:space:]])'"$ip_address"'([[:space:]]|$)' /etc/hosts; then
            read -p "  IP address '$ip_address' is already registered. Overwrite? (y/n): " answer
            answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
            if [[ "$answer" != "y" && "$answer" != "yes" ]]; then
                echo "Installation aborted."
                exit 1
            else
                sed -i -E '/(^|[[:space:]])'"$ip_address"'([[:space:]]|$)/d' /etc/hosts
            fi
        fi

        ips[i-1]="$ip_address"
    done

    # 입력받은 모든 호스트 정보를 /etc/hosts 파일에 추가
    for index in "${!hostnames[@]}"; do
        echo -e "${ips[index]}\t${hostnames[index]}" | tee -a /etc/hosts > /dev/null
    done
}

# 네트워크 Bonding 구성 함수
task_bonding() {
    # ───────────────────────────────────────────────────────────────────
    # 1. 기존 설정 파일 백업
    # ───────────────────────────────────────────────────────────────────
    timestamp=$(date '+%Y%m%d-%H%M%S')
    os_version=$(rpm -E %{rhel})
    
    # RHEL 8 이하: /etc/sysconfig/network-scripts 백업
    if [ "$os_version" -lt 9 ] && [ -d "/etc/sysconfig/network-scripts" ]; then
        if ! find /etc/sysconfig/network-scripts -maxdepth 1 -type d -name 'backup_*' | grep -q .; then
            backup_dir="/etc/sysconfig/network-scripts/backup_${timestamp}"
            mkdir -p "$backup_dir"
            cp -a /etc/sysconfig/network-scripts/ifcfg-e* "$backup_dir"/ 2>/dev/null || true
        fi
    fi
    
    # RHEL 9 이상: /etc/NetworkManager/system-connections 백업
    if [ "$os_version" -ge 9 ] && [ -d "/etc/NetworkManager/system-connections" ]; then
        if ! find /etc/NetworkManager/system-connections -maxdepth 1 -type d -name 'backup_*' | grep -q .; then
            backup_dir2="/etc/NetworkManager/system-connections/backup_${timestamp}"
            mkdir -p "$backup_dir2"
            find /etc/NetworkManager/system-connections \
                -maxdepth 1 -type f \
                -exec cp -a {} "$backup_dir2"/ \; 2>/dev/null || true
        fi
    fi

    # ───────────────────────────────────────────────────────────────────
    # 2. 사용 가능한 물리 네트워크 디바이스 목록 조회 (lo, virbr, bond 제외)
    # ───────────────────────────────────────────────────────────────────
    available_devices=$(nmcli d | tail -n +2 | awk '{print $1}' | grep -Ev 'lo|virbr|ovirtmgmt|br-int|ip_vti0|vdsmdummy|vnet')
    device_count=$(echo "$available_devices" | wc -w)
    if [ "$device_count" -lt 2 ]; then
        echo "[WARNING] A bonding configuration requires at least two network ports."
        echo "Number of ports currently available: $device_count"
        exit 1
    fi

    echo "- Network Bridge Interface Configuration"

    # ── 디바이스 정보 테이블 출력 ──
    col1_width=12; col2_width=7; col3_width=24; col4_width=5; col5_width=13; col6_width=15
    echo "┌──────────────┬─────────┬──────────────────────────┬───────┬───────────────┬────────────────┐"
    printf "│ %-${col1_width}s │ %-${col2_width}s │ %-${col3_width}s │ %-${col4_width}s │ %-${col5_width}s │ %-${col6_width}s│\n" \
        "DEVICE" "STATE" "CONNECTION" "SPEED" "DUPLEX" "IP"
    echo "├──────────────┼─────────┼──────────────────────────┼───────┼───────────────┼────────────────┤"
    for dev in $available_devices; do
        state=$(ip -br a s "$dev" | awk '{print $2}')
        conn=$(nmcli d | grep "^$dev " | awk '{print $4}')
        speed=$(ethtool "$dev" 2>/dev/null | awk -F: '/Speed/ {gsub(/ /,"",$2); print $2}' | sed 's/[^0-9]*//g')
        duplex=$(ethtool "$dev" 2>/dev/null | awk -F: '/Duplex/ {gsub(/ /,"",$2); print $2}')
        ip4=$(ip -br a s "$dev" | awk '{print $3}')
        printf "│ %-${col1_width}s │ %-${col2_width}s │ %-${col3_width}s │ %-${col4_width}s │ %-${col5_width}s │ %-${col6_width}s│\n" \
            "$dev" "$state" "$conn" "$speed" "$duplex" "$ip4"
    done
    echo "└──────────────┴─────────┴──────────────────────────┴───────┴───────────────┴────────────────┘"

    # ───────────────────────────────────────────────────────────────────
    # 3. 사용자에게 물리 NIC 2개 선택 받기
    # ───────────────────────────────────────────────────────────────────
    # ── Bond에 묶을 첫 번째 슬레이브 장치 선택 ──
    while true; do
        echo -n "> Bond First Device (ex: eno1): "
        read slave_first_device
        if echo "$available_devices" | grep -qw "$slave_first_device"; then
            break
        else
            echo "[WARNING] Invalid device. Enter a valid device name"
        fi
    done

    # ── Bond에 묶을 두 번째 슬레이브 장치 선택 ──
    while true; do
        echo -n "> Bond Second Device (ex: eno2): "
        read slave_second_device
        if [ "$slave_second_device" = "$slave_first_device" ]; then
            echo "[WARNING] Second device must be different from the first."
        elif echo "$available_devices" | grep -qw "$slave_second_device"; then
            break
        else
            echo "[WARNING] Invalid device. Enter a valid device name"
        fi
    done

    # ───────────────────────────────────────────────────────────────────
    # 4. Bond 이름 및 네트워크 정보 입력 받기
    # ───────────────────────────────────────────────────────────────────
    # ── Bond 이름 입력 ──
    while true; do
        read -e -i "bond0" -p "> Bond Name (ex: bond0): " bond_name
        if [[ -z "$bond_name" ]]; then
            echo "[WARNING] Bond name cannot be empty. Enter a bond name."
        else
            break
        fi
    done
    bond_name=${bond_name:-bond0}

    # ── Bond IP 입력 ──
    while true; do
        hostname_ip=$(grep "$(hostname)" /etc/hosts | grep -v localhost | awk '{print $1}' || true)
        if [[ -n "$hostname_ip" ]]; then
            read -e -i "$hostname_ip" -p "> $bond_name IP Address [$(hostname): ${hostname_ip}]: " bond_ip
            bond_ip=${bond_ip:-$hostname_ip}
        else
            read -p "> $bond_name IP Address: " bond_ip
        fi
        if [[ -z "$bond_ip" ]]; then
            echo "[WARNING] IP address cannot be empty."
        elif valid_ip "$bond_ip"; then
            break
        else
            echo "[WARNING] Invalid IPv4 address."
        fi
    done

    # ── 넷마스크 입력 ──
    while true; do
        read -e -i "24" -p "> Prefix (ex: 24): " network_prefix
        if [[ "$network_prefix" =~ ^([1-9]|[12][0-9]|3[01]|32)$ ]]; then
            break
        else
            echo "[WARNING] Netmask must be between 1 and 32."
        fi
    done

    # ── 게이트웨이 입력 ──
    while true; do
        read -e -i "${bond_ip%.*}." -p "> Gateway Address: " network_gateway
        network_gateway=${network_gateway:-${bond_ip%.*}.}
        if valid_ip "$network_gateway"; then
            break
        else
            echo "[WARNING] Invalid gateway IP address."
        fi
    done

    # ── DNS 정보 입력 ──
    while true; do
        read -e -i "8.8.8.8" -p "> DNS Server IP Address (Default: 8.8.8.8): " network_dns1
        network_dns1=${network_dns1:-8.8.8.8}
        if valid_ip "$network_dns1"; then
            break
        else
            echo "[WARNING] Invalid DNS server IP address."
        fi
    done

    # ───────────────────────────────────────────────────────────────────
    # 5. 기존 bond/slave 관련 프로파일 제거
    # ───────────────────────────────────────────────────────────────────
    for old in bond-slave-$slave_first_device bond-slave-$slave_second_device; do
        nmcli connection delete "$old" 2>/dev/null || true
    done
    for old in slave-$slave_first_device slave-$slave_second_device; do
        nmcli connection delete "$old" 2>/dev/null || true
    done

    for slave in "$slave_first_device" "$slave_second_device"; do
        con_name="${bond_name}.slave-${slave}"
        if nmcli connection show "$con_name" &>/dev/null; then
            nmcli connection delete "$con_name" >/dev/null 2>&1
        fi
    done

    # ───────────────────────────────────────────────────────────────────
    # 6. Bond 마스터 및 슬레이브 인터페이스 생성
    # ───────────────────────────────────────────────────────────────────
    # ── bond master 인터페이스 생성 (IPv4 설정 없이) ──
    if ! nmcli connection show "$bond_name" &>/dev/null; then
        nmcli connection add type bond \
            con-name "$bond_name" ifname "$bond_name" \
            bond.options "mode=1,miimon=100,primary=$slave_first_device" \
            autoconnect yes >/dev/null 2>&1
    fi

    # ── 각 슬레이브 인터페이스를 bond에 추가 ──
    for slave in "$slave_first_device" "$slave_second_device"; do
        con_name="${bond_name}.slave-${slave}"
        nmcli connection add type ethernet \
            con-name "$con_name" ifname "$slave" master "$bond_name" slave-type bond >/dev/null 2>&1
        nmcli connection up "$con_name" >/dev/null 2>&1
    done

    # ───────────────────────────────────────────────────────────────────
    # 7. Bond 마스터에 IP 설정 및 활성화
    # ───────────────────────────────────────────────────────────────────
    nmcli connection modify "$bond_name" \
        ipv4.method manual \
        ipv4.addresses "$bond_ip/$network_prefix" \
        ipv4.gateway "$network_gateway" \
        ipv4.dns "$network_dns1" \
        autoconnect yes >/dev/null 2>&1

    nmcli connection up "$bond_name" >/dev/null 2>&1

    # ───────────────────────────────────────────────────────────────────
    # 8. 기존 독립된 slave 프로파일 제거
    # ───────────────────────────────────────────────────────────────────
    for slave in "$slave_first_device" "$slave_second_device"; do
        nmcli -t -f NAME,DEVICE connection show | \
            awk -F: -v s="$slave" -v prefix="${bond_name}.slave-" '$2==s && $1!=prefix s {print $1}' | \
            xargs -r -n1 nmcli connection delete >/dev/null
    done

    # ───────────────────────────────────────────────────────────────────
    # 9. 다른 불필요한 Bond/slave 프로파일 정리
    # ───────────────────────────────────────────────────────────────────
    nmcli -t -f NAME,TYPE connection show | \
        awk -F: -v b="$bond_name" '$2=="bond" && $1!=b {print $1}' | \
        xargs -r -n1 nmcli connection delete >/dev/null

    # ── 사용하지 않는 slave-* 프로파일 정리 ──
    nmcli -t -f NAME connection show | \
        awk -F: \
            -v s1="${bond_name}.slave-${slave_first_device}" \
            -v s2="${bond_name}.slave-${slave_second_device}" \
            '$1~/^.*\.slave-/ && $1!=s1 && $1!=s2 {print $1}' | \
        xargs -r -n1 nmcli connection delete >/dev/null

    # ───────────────────────────────────────────────────────────────────
    # 10. 적용 및 검증
    # ───────────────────────────────────────────────────────────────────
    # ── 최종 변경 사항 적용을 위한 reload ──
    nmcli connection reload
    nmcli device reapply "$bond_name"

    # ───────────────────────────────────────────────────────────────────
    # 11. 구성을 확인하기 위한 결과 출력
    # ───────────────────────────────────────────────────────────────────
    echo
    sleep 4
    echo "- Bonding Configuration Information"
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
    nmcli d | grep -Ev "lo|virbr" | head -n 1
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
    nmcli d | grep -Ev "lo|virbr" | tail -n +2
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
    cat /proc/net/bonding/"$bond_name" | grep -Ev "Driver|Interval|Delay|addr|ID|Count" | tail -n +2
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
    ip4_address=$(nmcli c s "$bond_name" | grep IP4.ADDRESS | awk '{print $2}')
    ip4_gateway=$(nmcli c s "$bond_name" | grep IP4.GATEWAY | awk '{print $2}')
    ip4_dns=$(nmcli c s "$bond_name" | grep IP4.DNS | awk '{print $2}')
    bond_options=$(nmcli c s "$bond_name" | grep bond.options | awk '{print $2}' | head -n 1)
    echo "IP Address  : $ip4_address"
    echo "Gateway     : $ip4_gateway"
    echo "DNS         : $ip4_dns"
    echo "Bond option : $bond_options"
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
}

# NTP 서버 설정 함수
function task_ntp() {
    set +e   # 이 함수 안에서는 에러가 있어도 종료되지 않도록
    local ntp_address
    local default_ntp="203.248.240.140"
    local chrony_config="/etc/chrony.conf"

    # 1) 기존 chrony 설정 백업 (한 번만)
    if [ ! -f "${chrony_config}.org" ]; then
        cp "$chrony_config" "${chrony_config}.org"
        echo "Original chrony configuration backed up."
    fi

    echo "- Time Synchronization configuration"
    # 2) 사용자 입력 받기
    while true; do
        read -e -i "$default_ntp" -p "> NTP Server Address (Default: $default_ntp): " ntp_address
        ntp_address=${ntp_address:-$default_ntp}
        if valid_ip "$ntp_address"; then
            break
        else
            echo "[WARNING] Invalid IP address. Enter a valid IP address"
        fi
    done

    # 3) 설정 파일 업데이트
    # 3-1) 기존 server 항목 모두 삭제
    sed -i '/^server /d' "$chrony_config"
    # 3-2) pool … iburst 형태의 라인은 주석 처리
    sed -i '/^pool.*iburst/s/^/#/' "$chrony_config"
    # 3-3) "#log measurements statistics tracking" 아래에 새 server 삽입
    sed -i '/^#log measurements statistics tracking/a server '"$ntp_address"' iburst' "$chrony_config"

    echo "[ INFO  ] Chrony configuration updated with NTP server: $ntp_address"

    # 4) chronyd 재시작 (실패해도 스크립트 멈추지 않음)
    systemctl restart chronyd >/dev/null 2>&1 || echo "[WARNING] chronyd restart failed, continuing..."
    # 5) 한 번에 시간 보정
    chronyc -a makestep >/dev/null 2>&1
    # 6) 타임존 설정
    timedatectl set-timezone Asia/Seoul >/dev/null 2>&1

    echo "[ INFO  ] NTP timezone configured successfully"
    set -e   # 원래 동작(에러 시 중단)로 복원
}

# rutilvm 계정 생성 및 공개키 생성
function task_user_add() {
    # rutilvm 계정 생성 및 SSH 키 자동 생성 스크립트
	# - 계정이 존재하지 않으면 생성
	# - SSH 디렉토리 및 키 파일 자동 생성 및 권한 설정
	# - 기존 키 백업 처리
	USERNAME="rutilvm"
	GROUPNAME="rutilvm"
	PASSWORD="adminRoot!@#"
	USER_HOME="/home/$USERNAME"
	SSH_DIR="$USER_HOME/.ssh"
	KEY_PATH="$SSH_DIR/id_rsa"
	
    # 그룹 존재 확인 및 생성
    if ! getent group "$GROUPNAME" >/dev/null; then
        groupadd "$GROUPNAME"
    fi
    
	# 계정 존재 확인 및 생성
	if ! id "$USERNAME" &>/dev/null; then
	# 유저가 존재하지 않으면 홈 디렉토리를 포함하여 계정 생성
	useradd -m -d "$USER_HOME" "$USERNAME" >/dev/null 2>&1
	# 비밀번호 설정
	echo "$USERNAME:$PASSWORD" | chpasswd
	# root, wheel 그룹에 유저 추가 (관리 권한 부여)
	usermod -aG wheel,kvm "$USERNAME" >/dev/null 2>&1
	fi
	
	# .ssh 디렉토리 생성
	if [ ! -d "$SSH_DIR" ]; then
	mkdir -p "$SSH_DIR"
	# 해당 디렉토리의 소유자를 새로 만든 사용자로 설정
	chown "$USERNAME:$GROUPNAME" "$SSH_DIR"
	chmod 700 "$SSH_DIR"
	fi
	
	# 기존 SSH 키 백업
	if [ -f "$KEY_PATH" ]; then
	# 기존 개인 키가 존재할 경우 백업
	TIMESTAMP=$(date +%Y%m%d_%H%M%S)
	mv "$KEY_PATH" "${KEY_PATH}.bak_$TIMESTAMP"
	mv "${KEY_PATH}.pub" "${KEY_PATH}.pub.bak_$TIMESTAMP"
	fi
	
	# SSH 키 생성 (4096bit RSA, 비밀번호 X)
#	sudo -u "$USERNAME" ssh-keygen -t rsa -b 4096 -f "$KEY_PATH" -N "" >/dev/null 2>&1
    sudo -u "$USERNAME" ssh-keygen -t rsa -b 4096 -f "$KEY_PATH" -N "" -q </dev/null
#   runuser -l "$USERNAME" -c "ssh-keygen -t rsa -b 4096 -f '$KEY_PATH' -N ''" >/dev/null 2>&1
	cat $KEY_PATH.pub >> $SSH_DIR/authorized_keys
	chown $USERNAME:$GROUPNAME $SSH_DIR/authorized_keys
	chmod 600 $SSH_DIR/authorized_keys
	
	# SSH 키 파일 권한 및 소유자 설정
    chown "$USERNAME:$GROUPNAME" "$KEY_PATH" "$KEY_PATH.pub"
}

# vrish rutilvm 계정 생성
function task_virsh_user_add() {
# sudoers에 추가할 설정 라인 정의
LINE="vdsm ALL=(ALL) NOPASSWD: /bin/chown"

# sudoers 파일 경로 지정
FILE="/etc/sudoers"

# 해당 라인이 없으면 sudoers 파일에 추가
grep -Fxq "$LINE" "$FILE" || echo "$LINE" | tee -a "$FILE" > /dev/null

# rutilvm 사용자에 대해 비밀번호 'adminRoot!@#'을 libvirt 영역에 등록 (자동 입력)
echo "adminRoot!@#" | saslpasswd2 -p -c -a libvirt rutilvm
}

# ───────────────────────────────────────────────────────────────────
# 메인 스크립트 실행 부분
clear

# 시스템 정보 수집 및 출력
product_name=$(dmidecode -s system-product-name | tr -d '\n')
serial_number=$(dmidecode -s system-serial-number | tr -d '\n')
processor=$(lscpu | grep "Model name" | awk -F: '{print $2}' | sed 's/^ *//' | sort -u)
cpus=$(lscpu | awk -F: '/^CPU\(s\):/ {gsub(/^ +/, "", $2); print $2}')
total_memory=$(lsmem | awk '/Total online memory:/ {print $NF}')
os_version=$(cat /etc/redhat-release)
col1_width=91

# 시스템 정보와 경고 메시지를 박스 형태로 출력
echo ┌────────────────────────────────────────────────────────────────────────────────────────────┐
printf "│ %-${col1_width}s  │\n" "■ RutilVM Host Configuration"
echo ├────────────────────────────────────────────────────────────────────────────────────────────┤
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "* Installation Warnings"
printf "│ %-${col1_width}s│\n" "  - Do Not Interrupt: Avoid force-closing or interrupting the installation"
printf "│ %-${col1_width}s│\n" "  - Input Carefully: Be cautious with hostnames, IP addresses, and passwords"
printf "│ %-${col1_width}s│\n" "  - Run as Root: It's recommended to run the script as 'root'"
printf "│ %-${col1_width}s│\n" "  - Stable Network Required: Ensure network stability during the setup"
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "* Host Information"
printf "│ %-${col1_width}s│\n" "  - System Product Name   : $product_name"
printf "│ %-${col1_width}s│\n" "  - Serial Number         : $serial_number"
printf "│ %-${col1_width}s│\n" "  - Processor             : $processor * $cpus"
printf "│ %-${col1_width}s│\n" "  - Memory                : $total_memory"
printf "│ %-${col1_width}s│\n" ""
echo └────────────────────────────────────────────────────────────────────────────────────────────┘
echo

# ───────────────────────────────────────────────────────────────────
# 함수 호출 순서
#task_libvirted_enable
task_host_add       # 호스트명 및 /etc/hosts 설정
echo
task_bonding        # 네트워크 bonding 구성
echo
task_ntp            # NTP 서버 및 시간 설정
echo
task_user_add       # rutilvm 계정 생성 및 공개키 생성
task_virsh_user_add # virsh rutilvm 계정 생성
# ───────────────────────────────────────────────────────────────────

# 대상 파일 경로를 변수로 지정
#FILE="/etc/cockpit/disallowed-users"
# 원본 파일을 백업 (같은 디렉터리에 disallowed-users.bak으로 저장)
#cp "$FILE" "$FILE.bak"
# https://노드ip:/9090 접속시 root 접속 허용을 위해 root 주석 처리
#sed -i '/^[[:space:]]*root[[:space:]]*$/s/^/#/' "$FILE"

echo "Hosts configuration updated successfully"

# ───────────────────────────────────────────────────────────────────
# 스크립트 종료 직전에, 원래 콘솔 로그 레벨 복원
echo "$old_loglevel" > /proc/sys/kernel/printk
trap 'echo "$old_loglevel" > /proc/sys/kernel/printk' EXIT
# ───────────────────────────────────────────────────────────────────
"""
    # =============================================================================
    # --deploy --engine 옵션 처리
    # =============================================================================
    elif "--engine" in args:
        shell_script = r"""
#!/bin/bash

# RutilVM 4.5.5 Engine 설정용 스크립트 (CentOS Stream 8 기반)

stty erase ^H                  # 터미널에서 백스페이스 키 설정
export LANG=C                  # 시스템 언어 설정

# ───────────────────────────────────────────────────────────────────
# 호스트명 확인: hostname -i 결과에 127.0.0.1 또는 localhost 가 있으면 즉시 종료
ip_output=$(hostname -i)
if echo "$ip_output" | grep -qE '127\.0\.0\.1|localhost'; then
    echo "You must run host configuration first"
    exit 1
fi
# ───────────────────────────────────────────────────────────────────

# IP 주소 형식 검증 함수
# 입력받은 IP 주소가 0~255 범위의 4개 옥텟 형식에 맞는지 검사
valid_ip() {
    local ip=$1
    local regex='^((25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])$'
    if [[ $ip =~ $regex ]]; then
        return 0    # 유효한 IP
    else
        return 1    # 유효하지 않은 IP
    fi
}

# 멀티패스 구성 비활성화 상태시 활성화하는 함수
task_multipath() {
    # /etc/multipath.conf 파일이 없으면 mpathconf 실행
    if [ ! -f /etc/multipath.conf ]; then
        /sbin/mpathconf --enable > /dev/null 2>&1

        # multipath.conf 내용 덮어쓰기
        cat <<EOF > /etc/multipath.conf
defaults {
    polling_interval            5
    no_path_retry               16
    user_friendly_names         no
    flush_on_last_del           yes
    fast_io_fail_tmo            5
    dev_loss_tmo                30
    max_fds                     4096
}

blacklist {
    protocol "(scsi:adt|scsi:sbp)"
    devnode "^(rbd)[0-9]*"
}

overrides {
    no_path_retry   16
}

defaults {
    user_friendly_names no
}
EOF

    # multipathd 재시작
    systemctl restart multipathd > /dev/null 2>&1
    
    fi
}

# Fibre Channel 관련 호스트와 SCSI 버스를 리스캔하여 새로운 LUN을 감지하는 함수
task_lun_scan() {
    # Fibre Channel 호스트가 존재하면 각 호스트에 대해 SCSI 스캔 수행
    if [ -d "/sys/class/fc_host" ]; then
        host_device=$(ls -l /sys/class/fc_host | grep -v total | awk 'NF > 0 {print $9}')
        if [ -n "$host_device" ]; then
            for host_number in $host_device; do
#                echo "Rescanning host /sys/class/scsi_host/$host_number"
                echo "- - -" > /sys/class/scsi_host/$host_number/scan
            done
        fi
    fi
    # sg3_utils 패키지가 설치되어 있다면 rescan-scsi-bus.sh 명령어를 사용
    if rpm -q sg3_utils > /dev/null; then
        rescan-scsi-bus.sh -r | tail -n 3
    fi
}

# 초기 answers.conf.setup 파일을 생성하며 기본 설정 값을 작성
task_answers.conf() {
	cat << ANSWERS.CONF_EOF > /etc/ovirt-hosted-engine/answers.conf.setup
[environment:default]
OVEHOSTED_CORE/HE_OFFLINE_DEPLOYMENT=bool:True
OVEHOSTED_CORE/deployProceed=bool:True
OVEHOSTED_CORE/enableKeycloak=bool:False
OVEHOSTED_CORE/forceIpProceed=none:None
OVEHOSTED_CORE/screenProceed=bool:True
OVEHOSTED_ENGINE/clusterName=str:Default
OVEHOSTED_ENGINE/datacenterName=str:Default
OVEHOSTED_ENGINE/enableHcGlusterService=none:None
OVEHOSTED_ENGINE/insecureSSL=none:None
OVEHOSTED_ENGINE/adminPassword=str:admin!123
OVEHOSTED_NETWORK/bridgeName=str:ovirtmgmt
OVEHOSTED_NETWORK/network_test=str:ping
OVEHOSTED_NETWORK/network_test_tcp_address=none:None
OVEHOSTED_NETWORK/network_test_tcp_port=none:None
OVEHOSTED_NOTIF/destEmail=str:root@localhost
OVEHOSTED_NOTIF/smtpPort=str:25
OVEHOSTED_NOTIF/smtpServer=str:localhost
OVEHOSTED_NOTIF/sourceEmail=str:root@localhost
OVEHOSTED_STORAGE/discardSupport=bool:False
OVEHOSTED_STORAGE/iSCSIPortalUser=str:none:None
OVEHOSTED_STORAGE/imgSizeGB=str:185
OVEHOSTED_VM/vmDiskSizeGB=str:185
OVEHOSTED_STORAGE/lockspaceImageUUID=none:None
OVEHOSTED_STORAGE/lockspaceVolumeUUID=none:None
OVEHOSTED_STORAGE/metadataImageUUID=none:None
OVEHOSTED_STORAGE/metadataVolumeUUID=none:None
OVEHOSTED_STORAGE/storageDomainName=str:hosted_storage
OVEHOSTED_VM/OpenScapProfileName=none:None
OVEHOSTED_VM/applyOpenScapProfile=bool:False
OVEHOSTED_VM/automateVMShutdown=bool:True
OVEHOSTED_VM/cloudinitRootPwd=str:adminRoot!@#
OVEHOSTED_VM/cloudInitISO=str:generate
OVEHOSTED_VM/cloudinitExecuteEngineSetup=bool:True
OVEHOSTED_VM/cloudinitVMDNS=str:
OVEHOSTED_VM/cloudinitVMETCHOSTS=bool:True
OVEHOSTED_VM/cloudinitVMTZ=str:Asia/Seoul
OVEHOSTED_VM/emulatedMachine=str:pc
OVEHOSTED_VM/enableFips=bool:False
OVEHOSTED_VM/ovfArchive=str:
OVEHOSTED_VM/rootSshAccess=str:yes
OVEHOSTED_VM/rootSshPubkey=str:
OVEHOSTED_VM/vmCDRom=none:None
OVEHOSTED_VM/vmMemSizeMB=int:16384
OVEHOSTED_VM/vmVCpus=str:6
OVEHOSTED_NETWORK/host_name=str:hostname_value
OVEHOSTED_NETWORK/bridgeIf=str:bridgeIf_value
OVEHOSTED_NETWORK/gateway=str:gateway_value
OVEHOSTED_NETWORK/fqdn=str:fqdn_value
OVEHOSTED_VM/cloudinitInstanceDomainName=str:cloudinitInstanceDomainName_value
OVEHOSTED_VM/cloudinitInstanceHostName=str:cloudinitInstanceHostName_value
OVEHOSTED_VM/cloudinitVMStaticCIDR=str:cloudinitVMStaticCIDR_value
ANSWERS.CONF_EOF
}

# answers.conf.setup 파일에 추가 설정 값을 업데이트하고, 사용자 입력을 통해 네트워크, 호스트, IP, 브릿지 등 값을 수정
task_answers.conf_nfs_fc_iscsi() {
    # Python 스크립트를 이용해 무작위 MAC 주소 생성
	MAC_ADDR=$(python3 -c "from ovirt_hosted_engine_setup import util as ohostedutil; print(ohostedutil.randomMAC())")
	# 생성된 MAC 주소를 설정 파일에 추가
	echo "OVEHOSTED_VM/vmMACAddr=str:$MAC_ADDR" | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null

	# 현재 시스템의 호스트 이름을 가져와 설정 파일 내 기본값 대체
	current_hostname=$(hostname)
	sed -i "s/OVEHOSTED_NETWORK\/host_name=str:hostname_value/OVEHOSTED_NETWORK\/host_name=str:${current_hostname}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
	sed -i "s/OVEHOSTED_VM\/cloudinitInstanceHostName=str:cloudinitInstanceHostName_value/OVEHOSTED_VM\/cloudinitInstanceHostName=str:${current_hostname}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
	echo
    echo "- Engine Settings"
	# 사용자에게 엔진 VM 호스트 이름(fqdn)을 입력받음
	while true; do
	    echo -n "> Engine VM Hostname: "
	    read fqdn
	    if [ -n "$fqdn" ]; then
	        sed -i "s/OVEHOSTED_NETWORK\/fqdn=str:fqdn_value/OVEHOSTED_NETWORK\/fqdn=str:${fqdn}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
	        break
	    else
	        echo "[WARNING] The hostname cannot be empty. Enter a valid hostname."
	    fi
	done
    
	# 사용자에게 엔진 VM IP 주소 입력받음; 올바른 IP 형식인지 확인
    # 1. 현재 호스트 이름 추출
    hostname=$(hostname)
    
    # 2. /etc/hosts에서 호스트 이름과 일치하는 줄에서 IP 추출
    prefix_ip=$(grep -w "$hostname" /etc/hosts \
                 | awk '{print $1}' \
                 | head -n1)
    
    # 3. IP가 유효한 경우 앞 3옥텟만 추출 (예: 192.168.0.)
    prefix_ip="${prefix_ip%.*}."
    
    # 4. 사용자로부터 Engine IP 주소 입력 받기
    while true; do
        read -e -i "${prefix_ip%.*}." -p "> Engine IP Address: " engine_ip
        engine_ip=${engine_ip:-${prefix_ip%.*}.}
    
        if valid_ip "$engine_ip"; then
            cloudinitVMStaticCIDR="$engine_ip"
            break
        else
            echo "[WARNING] Invalid IP address. Please re-enter."
        fi
    done
    
    # 5. 설정 파일에서 해당 값을 교체
    sed -i "s|OVEHOSTED_VM/cloudinitVMStaticCIDR=str:cloudinitVMStaticCIDR_value|OVEHOSTED_VM/cloudinitVMStaticCIDR=str:${cloudinitVMStaticCIDR}|g" /etc/ovirt-hosted-engine/answers.conf.setup
    sed -i "s|OVEHOSTED_VM/cloudinitInstanceDomainName=str:cloudinitInstanceDomainName_value|OVEHOSTED_VM/cloudinitInstanceDomainName=str:${cloudinitVMStaticCIDR}|g" /etc/ovirt-hosted-engine/answers.conf.setup \
    | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null

	# 6. /etc/hosts 파일에서 해당 IP 또는 호스트 이름 항목이 존재하면 삭제 후 새롭게 추가
	if grep -q "^$cloudinitVMStaticCIDR" /etc/hosts; then
	    sed -i "/^$cloudinitVMStaticCIDR /d" /etc/hosts
	fi
	if grep -q " $fqdn$" /etc/hosts; then
	    sed -i "/ $fqdn$/d" /etc/hosts
	fi
	echo "$cloudinitVMStaticCIDR    $fqdn" | tee -a /etc/hosts > /dev/null

    # 1) bond 장치가 하나인지 검사하여, 하나일 땐 자동 설정만 수행
    mapfile -t bond_devs < <(nmcli -t -f DEVICE device | grep -E '^bond')
    if [ "${#bond_devs[@]}" -eq 1 ]; then
        bridgeIf="${bond_devs[0]}"
        # 선택한 NIC로 설정 파일 내 기본값 치환
        sed -i "s|OVEHOSTED_NETWORK/bridgeIf=str:bridgeIf_value|OVEHOSTED_NETWORK/bridgeIf=str:${bridgeIf}|g" \
            /etc/ovirt-hosted-engine/answers.conf.setup
    else
        # 2) bond 장치가 여러 개이거나 없으면 NIC 목록 출력 및 사용자 입력
        
        # 열 너비 설정
        col1_width=11; col2_width=14; col3_width=20
        col4_width=11; col5_width=11; col6_width=20
        echo
        echo "- NIC port available for bridge"
        echo "┌───────────┬──────────────┬────────────────────┬───────────┬───────────┬────────────────────┐"
        printf "│%-${col1_width}s│%-${col2_width}s│%-${col3_width}s│%-${col4_width}s│%-${col5_width}s│%-${col6_width}s│\n" \
            "DEVICE" "STATE" "CONNECTION" "SPEED" "DUPLEX" "IP"
        echo "├───────────┼──────────────┼────────────────────┼───────────┼───────────┼────────────────────┤"
    
        # (1) 인터페이스 목록 한 번만 가져오기
        mapfile -t device_list < <(
            nmcli -t -f DEVICE device \
                | grep -Ev 'lo|virbr|br-int|vdsmdummy|ip_vti|ovirtmgmt|bondscan|vnet'
        )
    
        # (2) nmcli 출력 캐싱 (DEVICE:STATE:CONNECTION)
        declare -A state_map connection_map ip_map
        while IFS=: read -r dev state conn; do
            state_map[$dev]=$state
            connection_map[$dev]=$conn
        done < <(nmcli -t -f DEVICE,STATE,CONNECTION device)
    
        # (3) ip -br -o address 출력 캐싱 (DEVICE + IPv4/CIDR)
        while read -r dev _ addr; do
            ip_map[$dev]=$addr
        done < <(ip -br -o -4 address)
    
        # (4) 루프 돌며 배열 조회 + ethtool 호출 최소화
        for dev in "${device_list[@]}"; do
            state=${state_map[$dev]:-DOWN}
            conn=${connection_map[$dev]:---}
            ip4=${ip_map[$dev]:-}
    
            # ethtool 호출 예외 처리 추가
            if ethtool "$dev" &>/dev/null; then
                read -r speed duplex < <(
                    ethtool "$dev" | awk -F': ' '
                        /Speed/  { gsub(/Mb\/s/,"",$2); speed=$2 }
                        /Duplex/ { duplex=$2; }
                        END { print speed, duplex }
                    '
                )
            else
                speed="N/A"
                duplex="N/A"
            fi
    
            speed=${speed%%!*}
            duplex=${duplex%%!*}
    
            printf "│%-${col1_width}s│%-${col2_width}s│%-${col3_width}s│%-${col4_width}s│%-${col5_width}s│%-${col6_width}s│\n" \
                "$dev" "$state" "$conn" "$speed" "$duplex" "$ip4"
        done
    
        echo "└───────────┴──────────────┴────────────────────┴───────────┴───────────┴────────────────────┘"
        echo
    
        # answers.conf.setup 에 bridgeIf 값을 설정하는 부분
        while true; do
            default_bridge="bond0"
            read -e -i "$default_bridge" -p "> Specify the NIC on which to configure the RutilVM bridge. (Default: ${default_bridge}): " bridgeIf
            bridgeIf=${bridgeIf:-$default_bridge}
    
            device_list=$(nmcli -t -f DEVICE device | grep -Ev 'lo|virbr')
            if [[ $device_list =~ (^|[[:space:]])$bridgeIf($|[[:space:]]) ]]; then
                sed -i "s|OVEHOSTED_NETWORK/bridgeIf=str:bridgeIf_value|OVEHOSTED_NETWORK/bridgeIf=str:${bridgeIf}|g" \
                    /etc/ovirt-hosted-engine/answers.conf.setup
                break
            else
                echo "[WARNING] Invalid device. Enter a valid device name."
            fi
        done
    fi

	# 게이트웨이 자동 조회 및 사용자 입력 처리
    while true; do
        # 1) 자동 조회
        gateway=$(ip route | grep default | awk '{print $3}' || true)
    
        # 2) 조회 결과가 비어 있거나, 형식이 올바르지 않으면 사용자 입력으로 대체
        if [[ -z "$gateway" ]] || ! valid_ip "$gateway"; then
            echo "[WARNING] Default gateway not found or invalid."
            read -p "> Gateway IP Address: " gateway
        fi
    
        # 3) 다시 검사: 반드시 비어 있지 않고, 유효한 IP여야 함
        if [[ -z "$gateway" ]]; then
            echo "[WARNING] Gateway cannot be empty."
            continue
        fi
        if ! valid_ip "$gateway"; then
            echo "[WARNING] '$gateway' is not a valid IPv4 or IPv6 address."
            continue
        fi
    
        # 4) 최종 반영
        sed -i "s|OVEHOSTED_NETWORK/gateway=str:gateway_value|OVEHOSTED_NETWORK/gateway=str:${gateway}|g" \
            /etc/ovirt-hosted-engine/answers.conf.setup \
            | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
    
        break
    done
}

# 사용자가 선택한 스토리지 타입(fc, nfs, iscsi)에 따라 answers.conf.setup 파일에
# 필요한 설정을 추가하고, 추가 입력을 받아 적절한 LUN 또는 NFS/iscsi 설정을 적용하는 함수임
task_answers.conf_storage_type() {
    echo "- Storage"
	# 무한 루프: 사용자가 올바른 스토리지 타입을 입력할 때까지 반복
	while true; do
		# 사용자에게 사용할 스토리지 타입을 입력 받음
		echo -n "> Storage Type (fc, nfs, iscsi): "
		read -r engine_storage
		# 입력된 스토리지 타입에 따른 처리
		case $engine_storage in
			# 1) fc (Fibre Channel) 선택 시
            fc)
                # ──────────────────────────────────────────────
                # fc(파이버 채널) 스토리지용 기본 설정을 answers.conf.setup 파일에 추가
                # ──────────────────────────────────────────────
                cat << ANSWERS.CONF_FC_EOF >> /etc/ovirt-hosted-engine/answers.conf.setup
OVEHOSTED_STORAGE/connectionTimeout=int:180
OVEHOSTED_STORAGE/multipathSupport=bool:True
OVEHOSTED_STORAGE/pathPolicy=str:multibus
OVEHOSTED_STORAGE/failoverTimeout=int:60
OVEHOSTED_STORAGE/storageDomainConnection=none:None
OVEHOSTED_STORAGE/domainType=str:fc
OVEHOSTED_STORAGE/lunDetectType=str:fc
OVEHOSTED_STORAGE/fcPaths=int:2
OVEHOSTED_STORAGE/nfsVersion=str:auto
OVEHOSTED_STORAGE/iSCSIDiscoverUser=none:None
OVEHOSTED_STORAGE/iSCSIPortal=none:None
OVEHOSTED_STORAGE/iSCSIPortalIPAddress=none:None
OVEHOSTED_STORAGE/iSCSIPortalPort=none:None
OVEHOSTED_STORAGE/iSCSITargetName=none:None
OVEHOSTED_STORAGE/mntOptions=str:
OVEHOSTED_STORAGE/LunID=str:LunID_value
ANSWERS.CONF_FC_EOF

                # ──────────────────────────────────────────────
                # LUN 선택을 위한 메인 루프 시작
                # (올바른 LUN을 고를 때까지 반복)
                # ──────────────────────────────────────────────
                while true; do
                    # ─── [1] 현재 LUN 목록 스캔 ───
                    task_lun_scan  # 시스템에 연결된 FC LUN들을 새로 스캔
                    task_multipath # 멀티패스가 비활성화 상태이면 활성화
                    
                    # multipath를 이용해 현재 스캔된 LUN 리스트 가져오기
                    if [ ! -f /etc/multipath.conf ]; then
                    #    echo "[WARNING] /etc/multipath.conf not found. Multipath not enabled."
                        multipath_output=""
                    else
                        multipath_output=$(multipath -ll 2>/dev/null)
                        if [ $? -ne 0 ]; then
                    #        echo "[WARNING] Failed to execute multipath -ll. Skipping LUN detection."
                            multipath_output=""
                        fi
                    fi
            
                    # LUN 목록을 저장할 배열 초기화
                    declare -a lun_list
            
                    # 각 LUN 정보를 저장할 변수 초기화
                    LunID_value=""
                    size=""
                    target_char=""
                    target_name=""
                    active_count=0
            
                    # ─── [2] multipath 출력 파싱 ───
                    prev_line=""
                    while IFS= read -r line; do
                        # (a) size= 줄이면, 바로 위 줄에서 WWID 및 관련 정보 추출
                        if [[ $line =~ size= ]]; then
                            LunID_value=$(echo "$prev_line" | awk '{print $1}')
                            size=$(echo "$line" | grep -oP 'size=\K[^ ]+')
                            target_char=$(echo "$prev_line" | awk '{print $2}')
                            target_name=$(echo "$prev_line" | cut -d' ' -f3-)
                            active_count=0
                        fi
                
                        # (b) 활성 경로(active path) 개수 세기
                        if [[ $line =~ ^\|- || $line =~ ^\`- ]]; then
                            active_count=$((active_count + 1))
                        fi
                
                        # (c) LUN 정보 수집 완료 시 배열에 저장
                        if [[ $line =~ ^\`- ]]; then
                            lun_list+=("$LunID_value;$size;$target_char;$target_name;$active_count")
                        fi
                
                        # 다음 라인을 위해 저장
                        prev_line="$line"
                    done <<< "$multipath_output"
            
                    # ──────────────────────────────────────────────
                    # [3] LUN 목록이 없는 경우
                    # ──────────────────────────────────────────────
                    if [ ${#lun_list[@]} -eq 0 ]; then
                        # 스캔된 LUN이 없으면 사용자에게 다시 스캔할지, 종료할지 물어봄
                        while true; do
                            echo
                            echo "No LUNs available for selection."
                            echo "1) LUN rescan"
                            echo "2) Exit"
                            echo -n "Select an action (1 or 2): "
                            read -r user_choice
            
                            if [ "$user_choice" == "1" ]; then
                                # 1을 누르면 LUN 스캔 다시 수행
                                task_lun_scan
                                continue 2   # 상위 while 루프로 재시작
                            elif [ "$user_choice" == "2" ]; then
                                # 2를 누르면 설치 중단
                                echo "Aborts installation."
                                exit 0
                            else
                                # 그 외 입력은 다시 질문
                                echo
                                echo "Invalid input. Try 1 or 2."
                            fi
                        done
            
                    else
                        # ──────────────────────────────────────────────
                        # [4] LUN 목록이 존재하는 경우
                        # ──────────────────────────────────────────────
                        echo "The following LUNs have been found on the requested target:"
                        index=1  # 표시용 인덱스 초기화
            
                        # 스캔된 LUN 리스트를 출력
                        for lun in "${lun_list[@]}"; do
                            IFS=';' read -r LunID_value size target_char target_name path_count <<< "$lun"
                            printf "[%d]     %-35s %-5s %-10s %-20s\n" "$index" "$LunID_value" "$size" "$target_char" "$target_name"
                            printf "                                     paths: %d active\n" "$path_count"
                            ((index++))
                        done
                        echo ""
         
                        # ──────────────────────────────────────────────
                        # [5] 사용자로부터 LUN 번호 입력 받기
                        # ──────────────────────────────────────────────
                        while true; do
                            echo -n "Select the target LUN (1 to $((index-1))): "
                            read -r selected_lun
            
                            # 입력값이 숫자이고, 유효한 범위(1 ~ index-1) 안이면
                            if [[ "$selected_lun" =~ ^[0-9]+$ ]] && ((selected_lun >= 1 && selected_lun <= index - 1)); then
                                # 올바른 선택
                                selected_lun_info="${lun_list[$selected_lun-1]}"
                                IFS=';' read -r LunID_value size target_char target_name path_count <<< "$selected_lun_info"
            
                                # 선택한 LUN ID를 answers.conf.setup 파일에 반영
                                sed -i "s/OVEHOSTED_STORAGE\/LunID=str:LunID_value/OVEHOSTED_STORAGE\/LunID=str:${LunID_value}/g" /etc/ovirt-hosted-engine/answers.conf.setup
            
                                break 2  # 전체 while 루프(메인) 탈출
                            else
                                # 잘못된 입력값이면 다시 입력 요청
                                echo "[WARNING] Invalid LUN selection. Try again."
                            fi
                        done
                    fi
                done
            
                # ──────────────────────────────────────────────
                # [6] fc 처리 완료 후 case 블록 종료
                # ──────────────────────────────────────────────
                break
                ;;

			# 2) nfs 선택 시
			nfs)
				# nfs용 기본 설정을 answers.conf.setup 파일 끝에 추가
				cat << ANSWERS.CONF_NFS_EOF >> /etc/ovirt-hosted-engine/answers.conf.setup
OVEHOSTED_STORAGE/LunID=none:None
OVEHOSTED_STORAGE/domainType=str:nfs
OVEHOSTED_STORAGE/iSCSIDiscoverUser=none:None
OVEHOSTED_STORAGE/iSCSIPortal=none:None
OVEHOSTED_STORAGE/iSCSIPortalIPAddress=none:None
OVEHOSTED_STORAGE/iSCSIPortalPort=none:None
OVEHOSTED_STORAGE/iSCSITargetName=none:None
OVEHOSTED_STORAGE/mntOptions=str:
OVEHOSTED_STORAGE/nfsVersion=str:auto
OVEHOSTED_STORAGE/storageDomainConnection=str:nfs_ip:nfs_storage_path
ANSWERS.CONF_NFS_EOF

				# 무한 루프: 올바른 NFS 서버 IP와 마운트 경로를 입력받을 때까지 반복
				while true; do
					echo -n "> NFS server IP Address: "
					read nfs_server_ip
					# IP 유효성 검사를 위한 함수 호출(valid_ip)
					if valid_ip "$nfs_server_ip"; then
						# showmount 명령으로 NFS 서버의 내보내기(export) 목록을 가져옴(첫 번째 라인 제외)
						output=$(showmount -e "$nfs_server_ip" | sed 1d)
						# 출력 결과가 없으면 NFS 서버로부터 응답이 없음을 알림
						if [ -z "$output" ]; then
                            echo
							echo "No response from NFS server. Check your IP or try again."
							# 재시도 또는 종료 옵션 제공
							while true; do
								echo "1) Retry"
								echo "2) Exit"
								read -p "Select (1 or 2): " retry_choice
								case $retry_choice in
									1)
										break
										;;
									2)
                                        echo "Aborts installation."
										exit 0
										;;
									*)
                                        echo
										echo "Invalid input. Try 1 or 2."
										;;
								esac
							done
							[[ $retry_choice -eq 1 ]] || break
							continue
						fi

                        # 내보내기 목록을 배열로 저장
                        IFS=$'\n' mounts=($output)
                        
                        for i in "${!mounts[@]}"; do
                            echo "[$((i+1))] ${mounts[$i]}"
                        done
                        
                        # 사용자에게 선택 입력을 받을 때 목록 외에는 재입력, 'n' 또는 'no' 입력 시 스크립트 종료
                        while true; do
                            read -p "Select NFS mount path [1-${#mounts[@]}] or type 'n' to exit: " choice
                        
                            # 'n' 또는 'no' 입력 시 스크립트 완전 종료
                            if [[ "$choice" =~ ^[nN]([oO])?$ ]]; then
                                echo "Aborts installation."
                                exit 0
                            fi
                        
                            # 숫자 입력인지, 그리고 범위(1~${#mounts[@]}) 안에 있는지 확인
                            if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= ${#mounts[@]} )); then
                                idx=$(( choice - 1 ))
                                nfs_storage_path=$(awk '{print $1}' <<< "${mounts[$idx]}")
                                break
                            fi
                        
                            echo "[WARNING] Invalid input. Enter a number between 1 and ${#mounts[@]}, or 'n' to exit."
                        done
						# answers.conf.setup 파일 내 nfs_ip와 nfs_storage_path 기본값을 실제 값으로 치환
						sed -i "s|nfs_ip|$nfs_server_ip|; s|nfs_storage_path|$nfs_storage_path|" /etc/ovirt-hosted-engine/answers.conf.setup
						break
					else
						echo "[WARNING] Invalid IP address. Check the IP address and try again."
					fi
				done
				# nfs 선택 처리 완료 시 무한 루프 종료
				break
				;;
			# 3) iscsi 선택 시
			iscsi)
				# iscsi용 기본 설정을 answers.conf.setup 파일 끝에 추가
				cat << ANSWERS.CONF_iSCSI_EOF >> /etc/ovirt-hosted-engine/answers.conf.setup
OVEHOSTED_STORAGE/connectionTimeout=int:180
OVEHOSTED_STORAGE/multipathSupport=bool:true
OVEHOSTED_STORAGE/pathPolicy=str:multibus
OVEHOSTED_STORAGE/failoverTimeout=int:60
OVEHOSTED_STORAGE/storageDomainConnection=none:None
OVEHOSTED_STORAGE/domainType=str:iscsi
OVEHOSTED_STORAGE/lunDetectType=str:iscsi
OVEHOSTED_STORAGE/iSCSIPortal=str:1
OVEHOSTED_STORAGE/iSCSIPortalPort=str:3260
OVEHOSTED_STORAGE/iSCSIPortalPassword=str:none:None
OVEHOSTED_STORAGE/mntOptions=none:None
OVEHOSTED_STORAGE/iSCSIPortalIPAddress=str:iSCSIPortalIPAddress_value
OVEHOSTED_STORAGE/iSCSIDiscoverUser=str:iSCSIDiscoverUser_value
OVEHOSTED_STORAGE/iSCSIDiscoverPassword=str:iSCSIDiscoverPassword_value
OVEHOSTED_STORAGE/iSCSITargetName=str:iSCSITargetName_value
OVEHOSTED_STORAGE/hostedEngineLUNID=str:LunID_value
OVEHOSTED_STORAGE/LunID=str:LunID_value
ANSWERS.CONF_iSCSI_EOF

				# iSCSI의 추가 정보 입력: discover user 및 password
				echo
				echo -n "> iSCSI discover user: "
				read iSCSIDiscoverUser
				sed -i "s/OVEHOSTED_STORAGE\/iSCSIDiscoverUser=str:iSCSIDiscoverUser_value/OVEHOSTED_STORAGE\/iSCSIDiscoverUser=str:${iSCSIDiscoverUser}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
				echo
				echo -n "> iSCSI discover password: "
				read iSCSIDiscoverPassword
				sed -i "s/OVEHOSTED_STORAGE\/iSCSIDiscoverPassword=str:iSCSIDiscoverPassword_value/OVEHOSTED_STORAGE\/iSCSIDiscoverPassword=str:${iSCSIDiscoverPassword}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
				echo

                # ──────────────────────────────────────────────
                # iSCSI Portal IP 주소 입력받고, 유효성 검사
                # ──────────────────────────────────────────────
                while true; do
                    echo
                    echo -n "> iSCSI portal IP Address: "
                    read iSCSIPortalIPAddress
                    if valid_ip "$iSCSIPortalIPAddress"; then
                        sed -i "s/OVEHOSTED_STORAGE\/iSCSIPortalIPAddress=str:iSCSIPortalIPAddress_value/OVEHOSTED_STORAGE\/iSCSIPortalIPAddress=str:${iSCSIPortalIPAddress}/g" /etc/ovirt-hosted-engine/answers.conf.setup
                        break
                    else
                        echo "[WARNING] Invalid IP address. Enter a valid IP address."
                    fi
                done
            
                # iscsiadm 명령으로 Target 검색
                DISCOVERY_OUTPUT=$(iscsiadm -m discovery -t sendtargets -p "$iSCSIPortalIPAddress" -P 1 2>/dev/null)
                TARGETS=($(echo "$DISCOVERY_OUTPUT" | grep -oP '(?<=Target: ).+'))
            
                if [ ${#TARGETS[@]} -eq 0 ]; then
                    echo "[ INFO  ] No iSCSI targets found for IP address $iSCSIPortalIPAddress."
                    exit 1
                fi
            
                # Target 목록 출력
                echo
                echo "The following targets have been found:"
                for i in "${!TARGETS[@]}"; do
                    echo "[$((i+1))]     ${TARGETS[$i]}"
                done
                echo
            
                # Target 선택 (올바른 번호만 허용)
                while true; do
                    read -p "select a target (1 to ${#TARGETS[@]}): " SELECTION
                    if [[ "$SELECTION" =~ ^[0-9]+$ ]] && [ "$SELECTION" -ge 1 ] && [ "$SELECTION" -le ${#TARGETS[@]} ]; then
                        iSCSITargetName="${TARGETS[$((SELECTION-1))]}"
                        sed -i "s/OVEHOSTED_STORAGE\/iSCSITargetName=str:iSCSITargetName_value/OVEHOSTED_STORAGE\/iSCSITargetName=str:${iSCSITargetName}/g" /etc/ovirt-hosted-engine/answers.conf.setup
                        break
                    else
                        echo "[WARNING] Invalid target selection. Enter a number between 1 and ${#TARGETS[@]}."
                    fi
                done
            
                # ──────────────────────────────────────────────
                # LUN 선택을 위한 메인 루프 시작
                # (올바른 LUN을 고를 때까지 반복)
                # ──────────────────────────────────────────────
                while true; do
                    # ─── [1] 현재 LUN 목록 스캔 ───
                    task_lun_scan  # 시스템에 연결된 FC LUN들을 새로 스캔
                    task_multipath # 멀티패스가 비활성화 상태이면 활성화
            
                    # multipath를 이용해 현재 스캔된 LUN 리스트 가져오기
                    if [ ! -f /etc/multipath.conf ]; then
                    #    echo "[WARNING] /etc/multipath.conf not found. Multipath not enabled."
                        multipath_output=""
                    else
                        multipath_output=$(multipath -ll 2>/dev/null)
                        if [ $? -ne 0 ]; then
                    #        echo "[WARNING] Failed to execute multipath -ll. Skipping LUN detection."
                            multipath_output=""
                        fi
                    fi
            
                    # LUN 목록을 저장할 배열 초기화
                    declare -a lun_list
            
                    # 각 LUN 정보를 저장할 변수 초기화
                    LunID_value=""
                    size=""
                    target_char=""
                    target_name=""
                    active_count=0
            
                    # ─── [2] multipath 출력 파싱 ───
                    prev_line=""
                    while IFS= read -r line; do
                        # (a) size= 줄이면, 바로 위 줄에서 WWID 및 관련 정보 추출
                        if [[ $line =~ size= ]]; then
                            LunID_value=$(echo "$prev_line" | awk '{print $1}')
                            size=$(echo "$line" | grep -oP 'size=\K[^ ]+')
                            target_char=$(echo "$prev_line" | awk '{print $2}')
                            target_name=$(echo "$prev_line" | cut -d' ' -f3-)
                            active_count=0
                        fi
                
                        # (b) 활성 경로(active path) 개수 세기
                        if [[ $line =~ ^\|- || $line =~ ^\`- ]]; then
                            active_count=$((active_count + 1))
                        fi
                
                        # (c) LUN 정보 수집 완료 시 배열에 저장
                        if [[ $line =~ ^\`- ]]; then
                            lun_list+=("$LunID_value;$size;$target_char;$target_name;$active_count")
                        fi
                
                        # 다음 라인을 위해 저장
                        prev_line="$line"
                    done <<< "$multipath_output"
            
                    # ──────────────────────────────────────────────
                    # [3] LUN 목록이 없는 경우
                    # ──────────────────────────────────────────────
                    if [ ${#lun_list[@]} -eq 0 ]; then
                        # 스캔된 LUN이 없으면 사용자에게 다시 스캔할지, 종료할지 물어봄
                        while true; do
                            echo
                            echo "No LUNs available for selection."
                            echo "1) LUN rescan"
                            echo "2) Exit"
                            echo -n "Select an action (1 or 2): "
                            read -r user_choice
            
                            if [ "$user_choice" == "1" ]; then
                                # 1을 누르면 LUN 스캔 다시 수행
                                task_lun_scan
                                continue 2   # 상위 while 루프로 재시작
                            elif [ "$user_choice" == "2" ]; then
                                # 2를 누르면 설치 중단
                                echo "Aborts installation."
                                exit 0
                            else
                                # 그 외 입력은 다시 질문
                                echo
                                echo "Invalid input. Try 1 or 2."
                            fi
                        done
            
                    else
                        # ──────────────────────────────────────────────
                        # [4] LUN 목록이 존재하는 경우
                        # ──────────────────────────────────────────────
                        echo "The following LUNs have been found on the requested target:"
                        index=1  # 표시용 인덱스 초기화
            
                        # 스캔된 LUN 리스트를 출력
                        for lun in "${lun_list[@]}"; do
                            IFS=';' read -r LunID_value size target_char target_name path_count <<< "$lun"
                            printf "[%d]     %-35s %-5s %-10s %-20s\n" "$index" "$LunID_value" "$size" "$target_char" "$target_name"
                            printf "                                     paths: %d active\n" "$path_count"
                            ((index++))
                        done
                        echo ""
         
                        # ──────────────────────────────────────────────
                        # [5] 사용자로부터 LUN 번호 입력 받기
                        # ──────────────────────────────────────────────
                        while true; do
                            echo -n "Select the target LUN (1 to $((index-1))): "
                            read -r selected_lun
            
                            # 입력값이 숫자이고, 유효한 범위(1 ~ index-1) 안이면
                            if [[ "$selected_lun" =~ ^[0-9]+$ ]] && ((selected_lun >= 1 && selected_lun <= index - 1)); then
                                # 올바른 선택
                                selected_lun_info="${lun_list[$selected_lun-1]}"
                                IFS=';' read -r LunID_value size target_char target_name path_count <<< "$selected_lun_info"
            
                                # 선택한 LUN ID를 answers.conf.setup 파일에 반영
                                sed -i "s/OVEHOSTED_STORAGE\/LunID=str:LunID_value/OVEHOSTED_STORAGE\/LunID=str:${LunID_value}/g" /etc/ovirt-hosted-engine/answers.conf.setup
            
                                break 2  # 전체 while 루프(메인) 탈출
                            else
                                # 잘못된 입력값이면 다시 입력 요청
                                echo "[WARNING] Invalid LUN selection. Try again."
                            fi
                        done
                    fi
                done
                break
                ;;
            # 기본(잘못된 입력) 분기 추가
            *)
                echo "[WARNING] Invalid storage type. Enter fc, nfs, or iscsi."
                ;;
		esac
	done
}

# 현재까지 구성된 설치 설정을 미리 보여주고, 사용자가 최종 설치 여부를 확인
task_configuration_preview() {
	while true; do
		# 미리보기 헤더 출력
        echo "─────────────────────────────────── CONFIGURATION PREVIEW ───────────────────────────────────"
		# 각 설정 항목을 출력 (fqdn, cloudinitVMStaticCIDR, gateway, bridge interface, 스토리지 연결 정보 등)
		echo "Engine VM Hostname                 : "$fqdn
		echo "Engine VM IP                       : "$cloudinitVMStaticCIDR
		echo "Gateway address                    : "$gateway
		echo "Bridge interface                   : "$bridgeIf "($MAC_ADDR)"
		echo "Storage connection                 : "$engine_storage
		# 스토리지 타입에 따라 추가 정보를 출력
		case $engine_storage in
			fc)
				echo "                                     $LunID_value"
				echo "                                     $size"
				;;
			iscsi)
				echo "                                     $TARGETS"
				echo "                                     $LunID_value"
				echo "                                     $size"
				;;
			nfs)
				echo "                                     $nfs_server_ip"
				echo "                                     $nfs_storage_path"
				;;
			*)
				;;
		esac
        echo "─────────────────────────────────────────────────────────────────────────────────────────────"
		echo
		# 사용자에게 최종 설치 설정 확인 입력 받음
		read -p "> Please confirm installation settings (Yes, No): " confirm_installation_yn
		# 사용자 입력에 따라 처리: yes면 루프 종료, no면 함수 종료(반환 값 1)
		case $confirm_installation_yn in
			yes|YES|y|Y|Yes)
				break
				;;
			no|NO|n|N|No)
                echo "[ INFO  ] Stage: Termination"
                echo "Aborts installation."
				exit 0
				;;
			*)
				echo "[WARNING] Invalid input. Enter 'y' for yes or 'n' for no."
                echo
				;;
		esac
	done
}

clear

# 출력할 첫 번째 컬럼의 너비를 91로 설정
col1_width=91
echo ┌────────────────────────────────────────────────────────────────────────────────────────────┐
printf "│ %-${col1_width}s  │\n" "■ RutilVM Engine Configuration"
echo ├────────────────────────────────────────────────────────────────────────────────────────────┤
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "* Pre-requisite Check"
printf "│ %-${col1_width}s│\n" "  - Hardware Requirements:"
printf "│ %-${col1_width}s│\n" "    You need to enable virtualization technology in your server's BIOS, such as "VT-x"."
printf "│ %-${col1_width}s│\n" "    The host system must have at least two network interfaces."
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "  - Storage Requirements:"
printf "│ %-${col1_width}s│\n" "    Prepare shared storage such as FC, iSCSI, or NFS."
printf "│ %-${col1_width}s│\n" "    The shared storage required for engine installation is 200 GB."
printf "│ %-${col1_width}s│\n" "    Shared storage for engine deployment once used cannot be used for reinstallation."
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "  - Network Requirements:"
printf "│ %-${col1_width}s│\n" "    Open firewall ports for SSH, Engine, etc."
printf "│ %-${col1_width}s│\n" "    If you use Network Access Control(NAC), register requirements such as IP and MAC"
printf "│ %-${col1_width}s│\n" "     addresses in advance before installing the engine."
printf "│ %-${col1_width}s│\n" ""
echo └────────────────────────────────────────────────────────────────────────────────────────────┘

# ───────────────────────────────────────────────────────────────────
# 함수 호출 순서
task_answers.conf
task_answers.conf_nfs_fc_iscsi
echo
task_answers.conf_storage_type
echo
task_configuration_preview
# ───────────────────────────────────────────────────────────────────

# 만약 task_configuration_preview 명령어의 종료 상태가 1이면 반복문이나 스크립트를 종료
if [[ $? -eq 1 ]]; then
	exit 1
fi

echo

# ovirt-engine-appliance 패키지가 설치되어 있는지 확인
if ! dnf list installed ovirt-engine-appliance &> /dev/null; then
    rpm_file=$(dnf --quiet repoquery --location ovirt-engine-appliance | sed 's|^file://||' | tail -n 1)
    
    if [[ -n "$rpm_file" && -f "$rpm_file" ]]; then
        echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Install the RutilVM engine package]"
        dnf install -y ovirt-engine-appliance >/dev/null 2>&1

        if dnf list installed ovirt-engine-appliance &> /dev/null; then
            echo "[ INFO  ] RutilVM engine package installation done."
        else
            echo "[WARNING] RutilVM engine package installation failed"
            echo "Aborts installation."
            exit 1
        fi
    else
        echo "[WARNING] The RutilVM engine package is not available in the repository"
        echo "Aborts installation."
        exit 1
    fi
fi


echo

# 현재 타임스탬프를 YYYYMMDDHHMMSS 형식으로 저장
timestamp=$(date +%Y%m%d%H%M%S)

# 기존의 answers.conf 파일이 존재하면 백업 처리
if [ -f /etc/ovirt-hosted-engine/answers.conf ]; then
	# 기존 파일을 타임스탬프가 포함된 이름으로 이동(백업)
	mv /etc/ovirt-hosted-engine/answers.conf /etc/ovirt-hosted-engine/answers.conf.$timestamp
	# 백업 실패 시 경고 메시지 출력 후 종료
	if [ $? -ne 0 ]; then
		echo "[WARNING] Failed to create backup of answers.conf" >&2
		exit 1
	fi
fi

# 새 설정 파일을 원본 파일 위치에 복사
cp /etc/ovirt-hosted-engine/answers.conf.setup /etc/ovirt-hosted-engine/answers.conf
# 복사 실패 시 경고 메시지 출력 후 종료
if [ $? -ne 0 ]; then
	echo "[WARNING] Failed to copy answers.conf" >&2
	exit 1
fi

# 날짜 및 시간을 포함한 로그 파일 이름 생성
LOG_FILE="/tmp/rutilvm-engine-setup_${timestamp}.log"

# 스크립트 종료 시 로그 파일을 삭제하도록 trap 등록 (oVirt 자체 로그 화면 출력 미사용 시)
#trap 'rm -f "$LOG_FILE"' EXIT

# engine-logs 디렉터리 생성 및 기존 로그 이동
# 로그 디렉토리 생성 (없을 경우)
[ ! -d /var/log/ovirt-hosted-engine-setup/engine-logs ] && mkdir -p /var/log/ovirt-hosted-engine-setup/engine-logs

# .log 파일이 하나라도 있을 경우에만 이동
if ls /var/log/ovirt-hosted-engine-setup/*.log 1>/dev/null 2>&1; then
  mv /var/log/ovirt-hosted-engine-setup/*.log /var/log/ovirt-hosted-engine-setup/engine-logs/
fi

# hosted-engine 배포 명령 실행 및 옵션 지정, 
# 결과를 awk 스크립트로 파이프를 통해 전달
hosted-engine --deploy --4 \
  --ansible-extra-vars=he_offline_deployment=true \
  --config-append=/etc/ovirt-hosted-engine/answers.conf | \
awk '
  BEGIN {
    skip_next_line = 0;    # “Fail” 메시지 다음 줄 스킵 플래그
    prev_skip      = 0;    # 중복 skipping 메시지 제어
    IGNORECASE     = 1;    # 대소문자 구분 없이 매칭/치환
  }
  {
    # 불필요한 정보 줄들 건너뛰기
    if ($0 ~ /STORAGE CONFIGURATION|HOST NETWORK CONFIGURATION|VM CONFIGURATION|HOSTED ENGINE CONFIGURATION|has no domain suffix|using DNS, it can be resolved only locally|Encryption using the Python crypt module is deprecated|The Python crypt module is deprecated and will be removed from Python|Install the passlib library for continued encryption functionality|Deprecation warnings can be disabled|by setting deprecation_warnings=False in ansible.cfg/)
      next;
    if ($0 ~ /^\s*$/)    # 공백 줄 스킵
      next;
    if (skip_next_line == 1) {
      skip_next_line = 0;
      next;
    }
    if ($0 ~ /TASK \[ovirt\.ovirt\.hosted_engine_setup : Fail/) {
      skip_next_line = 1;
      next;
    }

    # “[ INFO ] skipping: [localhost]” 중복 제어
    if ($0 ~ /^\[ INFO\s+\] skipping: \[localhost\]$/) {
      if (prev_skip)
        next;
      else {
        prev_skip = 1;
        gsub(/ovirt/, "rutilvm");  # 치환
        print;
        next;
      }
    } else {
      prev_skip = 0;
    }

    # 최종 출력 직전에 ovirt → rutilvm 치환
    gsub(/ovirt/, "rutilvm");
    print;
  }'

# 최신 로그 파일 하나만 가져오기
shopt -s nullglob
latest_log=$(ls -1t /var/log/ovirt-hosted-engine-setup/ovirt-hosted-engine-setup-[0-9]*.log 2>/dev/null | head -n 1)

# 파일이 존재하고, 실패 문자열이 있으면 종료
if [[ -n "$latest_log" ]]; then
    if grep -q -e "Hosted Engine deployment failed" -e "re-deploy" "$latest_log"; then
        exit 1
    fi
fi

# 설정 변수: 최대 대기 시간 2초, 인터벌 2초, 경과 시간 초기화
TIMEOUT=5
INTERVAL=2
elapsed_time=0

# cloudinit root 계정 암호 설정
cloudinitRootPwd=adminRoot!@#

# engine.zip 파일 암호
cloudinitEnginePwd=itinfo1!

# 엔진 연결 확인 작업 시작 메시지 출력
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Checking connection to engine]"

# 엔진에 연결할 수 있는지 TIMEOUT 시간 내에 반복하여 확인
while [ $elapsed_time -lt $TIMEOUT ]; do
	# 지정된 IP(cloudinitVMStaticCIDR)에 ping 테스트 수행하여 연결 확인
	if ping -c 1 $cloudinitVMStaticCIDR &> /dev/null; then
		echo "[ INFO  ] ok: [localhost]"
		sleep 2
        
		# 파일 시스템 조정 작업 시작 메시지 출력
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : File system adjustment start]"
		
        # ssh 통신 전 root 계정 known_hosts 목록 삭제 (재설치 시 변경된 엔진의 호스트 키 초기화)
        cat /dev/null > /root/.ssh/known_hosts
        
		# 파티션 크기 조정: 파티션 2를 전체 디스크로 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/parted -s /dev/vda resizepart 2 100% >/dev/null 2>&1
		
		# 물리 볼륨 리사이즈 수행
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/pvresize /dev/vda2 >/dev/null 2>&1
		
		# 논리 볼륨 확장 (루트 파티션에 +40G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +40G /dev/ovirt/root >/dev/null 2>&1
		
		# 논리 볼륨 확장 (var 파티션에 +45G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +45G /dev/ovirt/var >/dev/null 2>&1
		
		# 논리 볼륨 확장 (log 파티션에 +30G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +30G /dev/ovirt/log >/dev/null 2>&1
		
		# 파일 시스템 확장: 루트 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs / >/dev/null 2>&1
		
		# /var 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs /var >/dev/null 2>&1
		
		# /var/log 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs /var/log >/dev/null 2>&1

		echo "[ INFO  ] changed: [localhost]"
		
		# 엔진 재조정 관련 작업 준비: 원격지에 디렉터리 생성
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/bin/mkdir -p /var/share/pkg/rutilvm >/dev/null 2>&1
		
		# 엔진 재조정 준비 작업 시작 메시지 출력
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Preparing for engine rebalancing]"
		
		# 로컬에 있는 engine.zip 파일을 원격지의 /var/share/pkg/rutilvm/로 복사
        sshpass -p $cloudinitRootPwd scp -o StrictHostKeyChecking=no /var/share/pkg/repositories/engine.zip root@$cloudinitVMStaticCIDR:/var/share/pkg/rutilvm/ >/dev/null 2>&1
	
		# 원격지에서 암호를 이용해 압축 해제 (압축 해제 시 zipbomb 검출 비활성화)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "export UNZIP_DISABLE_ZIPBOMB_DETECTION=TRUE; /usr/bin/unzip -q -P $cloudinitEnginePwd -o /var/share/pkg/rutilvm/engine.zip -d /var/share/pkg/rutilvm/" >/dev/null 2>&1
	
		# 준비 완료 메시지 출력
		echo "[ INFO  ] ok: [localhost]"
		
        # 스크립트 파일 허가권 부여
		sshpass -p $cloudinitRootPwd ssh -tt -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "chmod 755 /var/share/pkg/rutilvm/engine/*.sh" 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
			
		# 원격지에서 RutilVM 설치 스크립트 실행
		sshpass -p $cloudinitRootPwd ssh -n -T -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /var/share/pkg/rutilvm/engine/rutilvm-engine-setup.sh 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
        
        # 원격지에서 RutilVM engine의 NTP 주소 변경
        if [ -z "$ntp_address" ]; then
            ntp_address=$(sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR \
            "grep -E '^\s*server\s+[0-9.]+\s+iburst\b' /etc/chrony.conf | head -n1 | awk '{print \$2}'") || true
        fi
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "ntp_address='$ntp_address'; sed -i \"s|^\s*server\s\+[0-9.]\+\s\+iburst\b|server \$ntp_address iburst|\" /etc/chrony.conf" 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed." || true
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "systemctl restart chronyd" || true
                
		# 원격지에서 /var/share/pkg/rutilvm 내의 *.zip 파일을 제외한 나머지 파일 및 디렉터리를 삭제
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/bin/find /var/share/pkg/rutilvm/ -mindepth 1 ! -name '*.zip' -exec rm -rf {} +

        # 현재 호스트의 rutilvm 계정 공개키를 Engine VM의 rutilvm 계정 authorized_keys에 등록
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Registering current host's public key to engine]"
        USERNAME="rutilvm"
        PASSWORD="adminRoot!@#"
        USER_HOME="/home/$USERNAME"
        SSH_DIR="$USER_HOME/.ssh"
        KEY_PATH="$SSH_DIR/id_rsa"
        sshpass -p "$PASSWORD" ssh-copy-id -o StrictHostKeyChecking=no -i $KEY_PATH.pub $USERNAME@"$cloudinitVMStaticCIDR" >/dev/null 2>&1
        echo "[ INFO  ] ok: [localhost]"
        
        # rutilvm 계정이 속한 ovirt 그룹이 /etc/ovirt-engine/aaa/internal.properties 파일을 read/write 할 수 있도록 권한 추가
        echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Granting rutilvm account permissions]"
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@"$cloudinitVMStaticCIDR" chmod 660 /etc/ovirt-engine/aaa/internal.properties
        echo "[ INFO  ] ok: [localhost]"

		# 최종 배포 성공 메시지 출력
		echo "RutilVM Hosted Engine successfully deployed"
		# 스크립트를 성공적으로 종료
		exit 0
	fi
	# ping 테스트 실패 시 지정된 인터벌만큼 대기
	sleep $INTERVAL
	# 경과 시간을 인터벌만큼 증가
	elapsed_time=$((elapsed_time + INTERVAL))
done

# TIMEOUT 시간 내에 엔진 연결에 실패하면 오류 메시지 출력 후 실패 종료
echo "Deployment failed. Exiting."
"""
    # =============================================================================
    # --deploy --all 옵션 처리
    # =============================================================================
    elif "--all" in args:
        shell_script = r"""
#!/bin/bash

# RutilVM 4.5.5 Node 설정용 스크립트 (CentOS Stream 8 기반)

set -e                         # 오류 발생 시 스크립트 중단. set -e 무시 옵션 : || true
set -o pipefail                # 파이프라인 에러 감지
stty erase ^H                  # 터미널에서 백스페이스 키 설정
export LANG=C                  # 시스템 언어 설정
export NMCLI_NOPROGRESS=1      # nmcli 진행 메시지 비활성화

# ───────────────────────────────────────────────────────────────────
# 1) 스크립트 시작 시 콘솔 로그 레벨을 낮추어 Bonding 관련 커널 메시지 숨김
old_loglevel=$(cat /proc/sys/kernel/printk)
# 숫자 2는 기본값이며, 필요시 3(에러 이상)나 4(경고 이상)로 설정 가능
echo 2 > /proc/sys/kernel/printk
# ───────────────────────────────────────────────────────────────────

# kickstart 설치 정보 파일 삭제 
# 대상 목록
FILES=(
    "/root/anaconda-ks.cfg"
    "/root/original-ks.cfg"
)

# 파일 존재 시 삭제
for file in "${FILES[@]}"; do
    [ -f "$file" ] && rm -f "$file"
done

task_libvirted_enable() {
# [BUG 처리] Failed to connect socket to '/var/run/libvirt/virtnetworkd-sock': No such file or directory 해결
systemctl enable libvirtd 2>/dev/null || true
systemctl start libvirtd 2>/dev/null || true
systemctl enable --now virtnetworkd.socket virtnetworkd 2>/dev/null || true
systemctl enable --now virtqemud.socket virtqemud 2>/dev/null || true
systemctl enable --now libvirtd.socket libvirtd 2>/dev/null || true
systemctl restart libvirtd virtqemud 2>/dev/null || true
}

# IP 주소 형식 검증 함수
# 입력받은 IP 주소가 0~255 범위의 4개 옥텟 형식에 맞는지 검사
valid_ip() {
    local ip=$1
    local regex='^((25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])$'
    if [[ $ip =~ $regex ]]; then
        return 0    # 유효한 IP
    else
        return 1    # 유효하지 않은 IP
    fi
}

# 호스트 등록 및 /etc/hosts 파일 업데이트 함수
task_host_add() {
    echo "- Hostname/Host Member Configuration"
    # 사용자가 설정할 호스트 수 입력받기 (최소 1 이상의 값)
    while true; do
        read -p "> Number of hosts to configure: " host_count
        if [[ "$host_count" =~ ^[1-9][0-9]*$ ]]; then
            break
        else
            echo "WARNING] Incorrect input. Enter a number 1 or higher."
        fi
    done

    declare -a hostnames     # 호스트명 배열
    declare -a ips           # IP 주소 배열

    # 첫 번째 호스트 정보 입력 (현재 호스트)
    read -p "> Hostname for the current host: " first_hostname
    # 이미 등록된 호스트명일 경우 확인 후 덮어쓰기 여부 판단
    if [ "$first_hostname" = "$(hostname)" ] || grep -qE '(^|[[:space:]])'"$first_hostname"'([[:space:]]|$)' /etc/hosts; then
        read -p "  Hostname '$first_hostname' is already registered. Overwrite? (y/n): " answer
        answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
        if [[ "$answer" != "y" && "$answer" != "yes" ]]; then
            echo "Installation aborted."
            exit 1
        else
            sed -i -E '/(^|[[:space:]])'"$first_hostname"'([[:space:]]|$)/d' /etc/hosts
        fi
    fi

    # 현재 호스트명이 아니면 hostnamectl로 변경
    if [ "$first_hostname" != "$(hostname)" ]; then
        hostnamectl set-hostname "$first_hostname"
        echo "[ INFO  ] Hostname changed to '$first_hostname'"
    fi

    # 첫 번째 호스트의 IP 주소 입력 및 형식 검증
    while true; do
        read -p "> IP address for $first_hostname: " first_ip
        if valid_ip "$first_ip"; then
            break
        else
            echo "[WARNING] Invalid IP address format. Enter a valid IP address."
        fi
    done

    # IP 주소가 이미 등록되어 있는지 확인, 덮어쓰기 여부 선택
    if ip -br a | grep -o -E '([0-9]{1,3}\.){3}[0-9]{1,3}' | grep -Fxq "$first_ip" || \
       grep -qE '(^|[[:space:]])'"$first_ip"'([[:space:]]|$)' /etc/hosts; then
        read -p "  IP address '$first_ip' is already registered. Overwrite? (y/n): " answer
        answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
        if [[ "$answer" != "y" && "$answer" != "yes" ]]; then
            echo "Installation aborted."
            exit 1
        else
            sed -i -E '/(^|[[:space:]])'"$first_ip"'([[:space:]]|$)/d' /etc/hosts
        fi
    fi

    # 첫 번째 호스트 정보 배열에 저장
    hostnames[0]="$first_hostname"
    ips[0]="$first_ip"
    # 첫 번째 IP의 앞부분(예: 192.168.1)을 추출하여 기본 IP 접두어로 사용
    ip_prefix=$(echo "$first_ip" | awk -F'.' '{print $1"."$2"."$3}')

    # 추가 호스트 정보를 입력받기 (입력받은 호스트 수 만큼 반복)
    for (( i=2; i<=host_count; i++ )); do
        while true; do
            read -p "> Hostname of the additional host: " hostname
            # 이미 등록된 호스트명인지 확인 후 덮어쓰기 여부 선택
            if [[ " ${hostnames[*]} " =~ (^|[[:space:]])"$hostname"($|[[:space:]]) ]] || \
               [ "$hostname" = "$(hostname)" ] || \
               grep -qE '(^|[[:space:]])'"$hostname"'([[:space:]]|$)' /etc/hosts; then
                read -p "  Hostname '$hostname' is already registered. Overwrite? (y/n): " answer
                answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
                if [[ "$answer" != "y" && "$answer" != "yes" ]]; then
                    echo "Installation aborted."
                    exit 1
                else
                    sed -i -E '/(^|[[:space:]])'"$hostname"'([[:space:]]|$)/d' /etc/hosts
                fi
            fi
            if [ -n "$hostname" ]; then
                break
            fi
        done
        hostnames[i-1]="$hostname"

        # 각 호스트에 대해 IP 주소 입력 (기본 접두어 제공)
        while true; do
            read -e -i "$ip_prefix." -p "> IP address for $hostname: " ip_address
            if valid_ip "$ip_address"; then
                break
            else
                echo "[WARNING] Invalid IP address. Enter a valid IP address."
            fi
        done

        # 입력받은 IP 주소가 이미 사용 중이면 덮어쓰기 여부 선택
        if [[ " ${ips[*]} " =~ (^|[[:space:]])"$ip_address"($|[[:space:]]) ]] || \
           ip -br a | grep -o -E '([0-9]{1,3}\.){3}[0-9]{1,3}' | grep -Fxq "$ip_address" || \
           grep -qE '(^|[[:space:]])'"$ip_address"'([[:space:]]|$)' /etc/hosts; then
            read -p "  IP address '$ip_address' is already registered. Overwrite? (y/n): " answer
            answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
            if [[ "$answer" != "y" && "$answer" != "yes" ]]; then
                echo "Installation aborted."
                exit 1
            else
                sed -i -E '/(^|[[:space:]])'"$ip_address"'([[:space:]]|$)/d' /etc/hosts
            fi
        fi

        ips[i-1]="$ip_address"
    done

    # 입력받은 모든 호스트 정보를 /etc/hosts 파일에 추가
    for index in "${!hostnames[@]}"; do
        echo -e "${ips[index]}\t${hostnames[index]}" | tee -a /etc/hosts > /dev/null
    done
}

# 네트워크 Bonding 구성 함수
task_bonding() {
    # ───────────────────────────────────────────────────────────────────
    # 1. 기존 설정 파일 백업
    # ───────────────────────────────────────────────────────────────────
    timestamp=$(date '+%Y%m%d-%H%M%S')
    os_version=$(rpm -E %{rhel})
    
    # RHEL 8 이하: /etc/sysconfig/network-scripts 백업
    if [ "$os_version" -lt 9 ] && [ -d "/etc/sysconfig/network-scripts" ]; then
        if ! find /etc/sysconfig/network-scripts -maxdepth 1 -type d -name 'backup_*' | grep -q .; then
            backup_dir="/etc/sysconfig/network-scripts/backup_${timestamp}"
            mkdir -p "$backup_dir"
            cp -a /etc/sysconfig/network-scripts/ifcfg-e* "$backup_dir"/ 2>/dev/null || true
        fi
    fi
    
    # RHEL 9 이상: /etc/NetworkManager/system-connections 백업
    if [ "$os_version" -ge 9 ] && [ -d "/etc/NetworkManager/system-connections" ]; then
        if ! find /etc/NetworkManager/system-connections -maxdepth 1 -type d -name 'backup_*' | grep -q .; then
            backup_dir2="/etc/NetworkManager/system-connections/backup_${timestamp}"
            mkdir -p "$backup_dir2"
            find /etc/NetworkManager/system-connections \
                -maxdepth 1 -type f \
                -exec cp -a {} "$backup_dir2"/ \; 2>/dev/null || true
        fi
    fi

    # ───────────────────────────────────────────────────────────────────
    # 2. 사용 가능한 물리 네트워크 디바이스 목록 조회 (lo, virbr, bond 제외)
    # ───────────────────────────────────────────────────────────────────
    available_devices=$(nmcli d | tail -n +2 | awk '{print $1}' | grep -Ev 'lo|virbr|ovirtmgmt|br-int|ip_vti0|vdsmdummy|vnet')
    device_count=$(echo "$available_devices" | wc -w)
    if [ "$device_count" -lt 2 ]; then
        echo "[WARNING] A bonding configuration requires at least two network ports."
        echo "Number of ports currently available: $device_count"
        exit 1
    fi

    echo "- Network Bridge Interface Configuration"

    # ── 디바이스 정보 테이블 출력 ──
    col1_width=12; col2_width=7; col3_width=24; col4_width=5; col5_width=13; col6_width=15
    echo "┌──────────────┬─────────┬──────────────────────────┬───────┬───────────────┬────────────────┐"
    printf "│ %-${col1_width}s │ %-${col2_width}s │ %-${col3_width}s │ %-${col4_width}s │ %-${col5_width}s │ %-${col6_width}s│\n" \
        "DEVICE" "STATE" "CONNECTION" "SPEED" "DUPLEX" "IP"
    echo "├──────────────┼─────────┼──────────────────────────┼───────┼───────────────┼────────────────┤"
    for dev in $available_devices; do
        state=$(ip -br a s "$dev" | awk '{print $2}')
        conn=$(nmcli d | grep "^$dev " | awk '{print $4}')
        speed=$(ethtool "$dev" 2>/dev/null | awk -F: '/Speed/ {gsub(/ /,"",$2); print $2}' | sed 's/[^0-9]*//g')
        duplex=$(ethtool "$dev" 2>/dev/null | awk -F: '/Duplex/ {gsub(/ /,"",$2); print $2}')
        ip4=$(ip -br a s "$dev" | awk '{print $3}')
        printf "│ %-${col1_width}s │ %-${col2_width}s │ %-${col3_width}s │ %-${col4_width}s │ %-${col5_width}s │ %-${col6_width}s│\n" \
            "$dev" "$state" "$conn" "$speed" "$duplex" "$ip4"
    done
    echo "└──────────────┴─────────┴──────────────────────────┴───────┴───────────────┴────────────────┘"

    # ───────────────────────────────────────────────────────────────────
    # 3. 사용자에게 물리 NIC 2개 선택 받기
    # ───────────────────────────────────────────────────────────────────
    # ── Bond에 묶을 첫 번째 슬레이브 장치 선택 ──
    while true; do
        echo -n "> Bond First Device (ex: eno1): "
        read slave_first_device
        if echo "$available_devices" | grep -qw "$slave_first_device"; then
            break
        else
            echo "[WARNING] Invalid device. Enter a valid device name"
        fi
    done

    # ── Bond에 묶을 두 번째 슬레이브 장치 선택 ──
    while true; do
        echo -n "> Bond Second Device (ex: eno2): "
        read slave_second_device
        if [ "$slave_second_device" = "$slave_first_device" ]; then
            echo "[WARNING] Second device must be different from the first."
        elif echo "$available_devices" | grep -qw "$slave_second_device"; then
            break
        else
            echo "[WARNING] Invalid device. Enter a valid device name"
        fi
    done

    # ───────────────────────────────────────────────────────────────────
    # 4. Bond 이름 및 네트워크 정보 입력 받기
    # ───────────────────────────────────────────────────────────────────
    # ── Bond 이름 입력 ──
    while true; do
        read -e -i "bond0" -p "> Bond Name (ex: bond0): " bond_name
        if [[ -z "$bond_name" ]]; then
            echo "[WARNING] Bond name cannot be empty. Enter a bond name."
        else
            break
        fi
    done
    bond_name=${bond_name:-bond0}

    # ── Bond IP 입력 ──
    while true; do
        hostname_ip=$(grep "$(hostname)" /etc/hosts | grep -v localhost | awk '{print $1}' || true)
        if [[ -n "$hostname_ip" ]]; then
            read -e -i "$hostname_ip" -p "> $bond_name IP Address [$(hostname): ${hostname_ip}]: " bond_ip
            bond_ip=${bond_ip:-$hostname_ip}
        else
            read -p "> $bond_name IP Address: " bond_ip
        fi
        if [[ -z "$bond_ip" ]]; then
            echo "[WARNING] IP address cannot be empty."
        elif valid_ip "$bond_ip"; then
            break
        else
            echo "[WARNING] Invalid IPv4 address."
        fi
    done

    # ── 넷마스크 입력 ──
    while true; do
        read -e -i "24" -p "> Prefix (ex: 24): " network_prefix
        if [[ "$network_prefix" =~ ^([1-9]|[12][0-9]|3[01]|32)$ ]]; then
            break
        else
            echo "[WARNING] Netmask must be between 1 and 32."
        fi
    done

    # ── 게이트웨이 입력 ──
    while true; do
        read -e -i "${bond_ip%.*}." -p "> Gateway Address: " network_gateway
        network_gateway=${network_gateway:-${bond_ip%.*}.}
        if valid_ip "$network_gateway"; then
            break
        else
            echo "[WARNING] Invalid gateway IP address."
        fi
    done

    # ── DNS 정보 입력 ──
    while true; do
        read -e -i "8.8.8.8" -p "> DNS Server IP Address (Default: 8.8.8.8): " network_dns1
        network_dns1=${network_dns1:-8.8.8.8}
        if valid_ip "$network_dns1"; then
            break
        else
            echo "[WARNING] Invalid DNS server IP address."
        fi
    done

    # ───────────────────────────────────────────────────────────────────
    # 5. 기존 bond/slave 관련 프로파일 제거
    # ───────────────────────────────────────────────────────────────────
    for old in bond-slave-$slave_first_device bond-slave-$slave_second_device; do
        nmcli connection delete "$old" 2>/dev/null || true
    done
    for old in slave-$slave_first_device slave-$slave_second_device; do
        nmcli connection delete "$old" 2>/dev/null || true
    done

    for slave in "$slave_first_device" "$slave_second_device"; do
        con_name="${bond_name}.slave-${slave}"
        if nmcli connection show "$con_name" &>/dev/null; then
            nmcli connection delete "$con_name" >/dev/null 2>&1
        fi
    done

    # ───────────────────────────────────────────────────────────────────
    # 6. Bond 마스터 및 슬레이브 인터페이스 생성
    # ───────────────────────────────────────────────────────────────────
    # ── bond master 인터페이스 생성 (IPv4 설정 없이) ──
    if ! nmcli connection show "$bond_name" &>/dev/null; then
        nmcli connection add type bond \
            con-name "$bond_name" ifname "$bond_name" \
            bond.options "mode=1,miimon=100,primary=$slave_first_device" \
            autoconnect yes >/dev/null 2>&1
    fi

    # ── 각 슬레이브 인터페이스를 bond에 추가 ──
    for slave in "$slave_first_device" "$slave_second_device"; do
        con_name="${bond_name}.slave-${slave}"
        nmcli connection add type ethernet \
            con-name "$con_name" ifname "$slave" master "$bond_name" slave-type bond >/dev/null 2>&1
        nmcli connection up "$con_name" >/dev/null 2>&1
    done

    # ───────────────────────────────────────────────────────────────────
    # 7. Bond 마스터에 IP 설정 및 활성화
    # ───────────────────────────────────────────────────────────────────
    nmcli connection modify "$bond_name" \
        ipv4.method manual \
        ipv4.addresses "$bond_ip/$network_prefix" \
        ipv4.gateway "$network_gateway" \
        ipv4.dns "$network_dns1" \
        autoconnect yes >/dev/null 2>&1

    nmcli connection up "$bond_name" >/dev/null 2>&1

    # ───────────────────────────────────────────────────────────────────
    # 8. 기존 독립된 slave 프로파일 제거
    # ───────────────────────────────────────────────────────────────────
    for slave in "$slave_first_device" "$slave_second_device"; do
        nmcli -t -f NAME,DEVICE connection show | \
            awk -F: -v s="$slave" -v prefix="${bond_name}.slave-" '$2==s && $1!=prefix s {print $1}' | \
            xargs -r -n1 nmcli connection delete >/dev/null
    done

    # ───────────────────────────────────────────────────────────────────
    # 9. 다른 불필요한 Bond/slave 프로파일 정리
    # ───────────────────────────────────────────────────────────────────
    nmcli -t -f NAME,TYPE connection show | \
        awk -F: -v b="$bond_name" '$2=="bond" && $1!=b {print $1}' | \
        xargs -r -n1 nmcli connection delete >/dev/null

    # ── 사용하지 않는 slave-* 프로파일 정리 ──
    nmcli -t -f NAME connection show | \
        awk -F: \
            -v s1="${bond_name}.slave-${slave_first_device}" \
            -v s2="${bond_name}.slave-${slave_second_device}" \
            '$1~/^.*\.slave-/ && $1!=s1 && $1!=s2 {print $1}' | \
        xargs -r -n1 nmcli connection delete >/dev/null

    # ───────────────────────────────────────────────────────────────────
    # 10. 적용 및 검증
    # ───────────────────────────────────────────────────────────────────
    # ── 최종 변경 사항 적용을 위한 reload ──
    nmcli connection reload
    nmcli device reapply "$bond_name"

    # ───────────────────────────────────────────────────────────────────
    # 11. 구성을 확인하기 위한 결과 출력
    # ───────────────────────────────────────────────────────────────────
    echo
    sleep 4
    echo "- Bonding Configuration Information"
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
    nmcli d | grep -Ev "lo|virbr" | head -n 1
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
    nmcli d | grep -Ev "lo|virbr" | tail -n +2
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
    cat /proc/net/bonding/"$bond_name" | grep -Ev "Driver|Interval|Delay|addr|ID|Count" | tail -n +2
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
    ip4_address=$(nmcli c s "$bond_name" | grep IP4.ADDRESS | awk '{print $2}')
    ip4_gateway=$(nmcli c s "$bond_name" | grep IP4.GATEWAY | awk '{print $2}')
    ip4_dns=$(nmcli c s "$bond_name" | grep IP4.DNS | awk '{print $2}')
    bond_options=$(nmcli c s "$bond_name" | grep bond.options | awk '{print $2}' | head -n 1)
    echo "IP Address  : $ip4_address"
    echo "Gateway     : $ip4_gateway"
    echo "DNS         : $ip4_dns"
    echo "Bond option : $bond_options"
    echo "──────────────────────────────────────────────────────────────────────────────────────────────"
}

# NTP 서버 설정 함수
function task_ntp() {
    set +e   # 이 함수 안에서는 에러가 있어도 종료되지 않도록
    local ntp_address
    local default_ntp="203.248.240.140"
    local chrony_config="/etc/chrony.conf"

    # 1) 기존 chrony 설정 백업 (한 번만)
    if [ ! -f "${chrony_config}.org" ]; then
        cp "$chrony_config" "${chrony_config}.org"
        echo "Original chrony configuration backed up."
    fi

    echo "- Time Synchronization configuration"
    # 2) 사용자 입력 받기
    while true; do
        read -e -i "$default_ntp" -p "> NTP Server Address (Default: $default_ntp): " ntp_address
        ntp_address=${ntp_address:-$default_ntp}
        if valid_ip "$ntp_address"; then
            break
        else
            echo "[WARNING] Invalid IP address. Enter a valid IP address"
        fi
    done

    # 3) 설정 파일 업데이트
    # 3-1) 기존 server 항목 모두 삭제
    sed -i '/^server /d' "$chrony_config"
    # 3-2) pool … iburst 형태의 라인은 주석 처리
    sed -i '/^pool.*iburst/s/^/#/' "$chrony_config"
    # 3-3) "#log measurements statistics tracking" 아래에 새 server 삽입
    sed -i '/^#log measurements statistics tracking/a server '"$ntp_address"' iburst' "$chrony_config"

    echo "[ INFO  ] Chrony configuration updated with NTP server: $ntp_address"

    # 4) chronyd 재시작 (실패해도 스크립트 멈추지 않음)
    systemctl restart chronyd >/dev/null 2>&1 || echo "[WARNING] chronyd restart failed, continuing..."
    # 5) 한 번에 시간 보정
    chronyc -a makestep >/dev/null 2>&1
    # 6) 타임존 설정
    timedatectl set-timezone Asia/Seoul >/dev/null 2>&1

    echo "[ INFO  ] NTP timezone configured successfully"
    set -e   # 원래 동작(에러 시 중단)로 복원
}

# rutilvm 계정 생성 및 공개키 생성
function task_user_add() {
    # rutilvm 계정 생성 및 SSH 키 자동 생성 스크립트
	# - 계정이 존재하지 않으면 생성
	# - SSH 디렉토리 및 키 파일 자동 생성 및 권한 설정
	# - 기존 키 백업 처리
	USERNAME="rutilvm"
	GROUPNAME="rutilvm"
	PASSWORD="adminRoot!@#"
	USER_HOME="/home/$USERNAME"
	SSH_DIR="$USER_HOME/.ssh"
	KEY_PATH="$SSH_DIR/id_rsa"
	
    # 그룹 존재 확인 및 생성
    if ! getent group "$GROUPNAME" >/dev/null; then
        groupadd "$GROUPNAME"
    fi
    
	# 계정 존재 확인 및 생성
	if ! id "$USERNAME" &>/dev/null; then
	# 유저가 존재하지 않으면 홈 디렉토리를 포함하여 계정 생성
	useradd -m -d "$USER_HOME" "$USERNAME" >/dev/null 2>&1
	# 비밀번호 설정
	echo "$USERNAME:$PASSWORD" | chpasswd
	# root, wheel 그룹에 유저 추가 (관리 권한 부여)
	usermod -aG wheel,kvm "$USERNAME" >/dev/null 2>&1
	fi
	
	# .ssh 디렉토리 생성
	if [ ! -d "$SSH_DIR" ]; then
	mkdir -p "$SSH_DIR"
	# 해당 디렉토리의 소유자를 새로 만든 사용자로 설정
	chown "$USERNAME:$GROUPNAME" "$SSH_DIR"
	chmod 700 "$SSH_DIR"
	fi
	
	# 기존 SSH 키 백업
	if [ -f "$KEY_PATH" ]; then
	# 기존 개인 키가 존재할 경우 백업
	TIMESTAMP=$(date +%Y%m%d_%H%M%S)
	mv "$KEY_PATH" "${KEY_PATH}.bak_$TIMESTAMP"
	mv "${KEY_PATH}.pub" "${KEY_PATH}.pub.bak_$TIMESTAMP"
	fi
	
	# SSH 키 생성 (4096bit RSA, 비밀번호 X)
#	sudo -u "$USERNAME" ssh-keygen -t rsa -b 4096 -f "$KEY_PATH" -N "" >/dev/null 2>&1
    sudo -u "$USERNAME" ssh-keygen -t rsa -b 4096 -f "$KEY_PATH" -N "" -q </dev/null
#   runuser -l "$USERNAME" -c "ssh-keygen -t rsa -b 4096 -f '$KEY_PATH' -N ''" >/dev/null 2>&1
	cat $KEY_PATH.pub >> $SSH_DIR/authorized_keys
	chown $USERNAME:$GROUPNAME $SSH_DIR/authorized_keys
	chmod 600 $SSH_DIR/authorized_keys
	
	# SSH 키 파일 권한 및 소유자 설정
    chown "$USERNAME:$GROUPNAME" "$KEY_PATH" "$KEY_PATH.pub"
}

# vrish rutilvm 계정 생성
function task_virsh_user_add() {
# sudoers에 추가할 설정 라인 정의
LINE="vdsm ALL=(ALL) NOPASSWD: /bin/chown"

# sudoers 파일 경로 지정
FILE="/etc/sudoers"

# 해당 라인이 없으면 sudoers 파일에 추가
grep -Fxq "$LINE" "$FILE" || echo "$LINE" | tee -a "$FILE" > /dev/null

# rutilvm 사용자에 대해 비밀번호 'adminRoot!@#'을 libvirt 영역에 등록 (자동 입력)
echo "adminRoot!@#" | saslpasswd2 -p -c -a libvirt rutilvm
}

product_name=$(dmidecode -s system-product-name | tr -d '\n')
serial_number=$(dmidecode -s system-serial-number | tr -d '\n')
processor=$(lscpu | grep "Model name" | awk -F: '{print $2}' | sed 's/^ *//' | sort -u)
cpus=$(lscpu | awk -F: '/^CPU\(s\):/ {gsub(/^ +/, "", $2); print $2}')
total_memory=$(lsmem | awk '/Total online memory:/ {print $NF}')
os_version=$(cat /etc/redhat-release)
col1_width=91

clear


# 출력할 첫 번째 컬럼의 너비를 91로 설정
echo ┌────────────────────────────────────────────────────────────────────────────────────────────┐
printf "│ %-${col1_width}s  │\n" "■ RutilVM Installation"
echo ├────────────────────────────────────────────────────────────────────────────────────────────┤
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "* Pre-requisite Check"
printf "│ %-${col1_width}s│\n" "  - Hardware Requirements:"
printf "│ %-${col1_width}s│\n" "    You need to enable virtualization technology in your server's BIOS, such as "VT-x"."
printf "│ %-${col1_width}s│\n" "    The host system must have at least two network interfaces."
printf "│ %-${col1_width}s│\n" "  - Storage Requirements:"
printf "│ %-${col1_width}s│\n" "    Prepare shared storage such as FC, iSCSI, or NFS."
printf "│ %-${col1_width}s│\n" "    The shared storage required for engine installation is 200 GB."
printf "│ %-${col1_width}s│\n" "    Shared storage for engine deployment once used cannot be used for reinstallation."
printf "│ %-${col1_width}s│\n" "  - Network Requirements:"
printf "│ %-${col1_width}s│\n" "    Open firewall ports for SSH, Engine, etc."
printf "│ %-${col1_width}s│\n" "    If you use Network Access Control(NAC), register requirements such as IP and MAC"
printf "│ %-${col1_width}s│\n" "     addresses in advance before installing the engine."
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "* Installation Warnings"
printf "│ %-${col1_width}s│\n" "  - Do Not Interrupt: Avoid force-closing or interrupting the installation"
printf "│ %-${col1_width}s│\n" "  - Input Carefully: Be cautious with hostnames, IP addresses, and passwords"
printf "│ %-${col1_width}s│\n" "  - Run as Root: It's recommended to run the script as 'root'"
printf "│ %-${col1_width}s│\n" "  - Stable Network Required: Ensure network stability during the setup"
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "* Host Information"
printf "│ %-${col1_width}s│\n" "  - System Product Name   : $product_name"
printf "│ %-${col1_width}s│\n" "  - Serial Number         : $serial_number"
printf "│ %-${col1_width}s│\n" "  - Processor             : $processor * $cpus"
printf "│ %-${col1_width}s│\n" "  - Memory                : $total_memory"
printf "│ %-${col1_width}s│\n" ""
echo └────────────────────────────────────────────────────────────────────────────────────────────┘
echo

# ───────────────────────────────────────────────────────────────────
# 함수 호출 순서
#task_libvirted_enable
task_host_add       # 호스트명 및 /etc/hosts 설정
echo
task_bonding        # 네트워크 bonding 구성
echo
task_ntp            # NTP 서버 및 시간 설정
task_user_add       # rutilvm 계정 생성 및 공개키 생성
task_virsh_user_add # virsh rutilvm 계정 생성
# ───────────────────────────────────────────────────────────────────

# https://노드ip:/9090 접속시 root 접속 허용을 위해 root 주석 처리
FILE="/etc/cockpit/disallowed-users"
cp "$FILE" "$FILE.bak"
sed -i '/^[[:space:]]*root[[:space:]]*$/s/^/#/' "$FILE"

# ───────────────────────────────────────────────────────────────────
# 스크립트 종료 직전에, 원래 콘솔 로그 레벨 복원
echo "$old_loglevel" > /proc/sys/kernel/printk
trap 'echo "$old_loglevel" > /proc/sys/kernel/printk' EXIT
# ───────────────────────────────────────────────────────────────────

# 멀티패스 구성 비활성화 상태시 활성화하는 함수
task_multipath() {
    # /etc/multipath.conf 파일이 없으면 mpathconf 실행
    if [ ! -f /etc/multipath.conf ]; then
        /sbin/mpathconf --enable > /dev/null 2>&1

        # multipath.conf 내용 덮어쓰기
        cat <<EOF > /etc/multipath.conf
defaults {
    polling_interval            5
    no_path_retry               16
    user_friendly_names         no
    flush_on_last_del           yes
    fast_io_fail_tmo            5
    dev_loss_tmo                30
    max_fds                     4096
}

blacklist {
    protocol "(scsi:adt|scsi:sbp)"
    devnode "^(rbd)[0-9]*"
}

overrides {
    no_path_retry   16
}

defaults {
    user_friendly_names no
}
EOF

    # multipathd 재시작
    systemctl restart multipathd > /dev/null 2>&1
    
    fi
}

# Fibre Channel 관련 호스트와 SCSI 버스를 리스캔하여 새로운 LUN을 감지하는 함수
task_lun_scan() {
    # Fibre Channel 호스트가 존재하면 각 호스트에 대해 SCSI 스캔 수행
    if [ -d "/sys/class/fc_host" ]; then
        host_device=$(ls -l /sys/class/fc_host | grep -v total | awk 'NF > 0 {print $9}')
        if [ -n "$host_device" ]; then
            for host_number in $host_device; do
#                echo "Rescanning host /sys/class/scsi_host/$host_number"
                echo "- - -" > /sys/class/scsi_host/$host_number/scan
            done
        fi
    fi
    # sg3_utils 패키지가 설치되어 있다면 rescan-scsi-bus.sh 명령어를 사용
    if rpm -q sg3_utils > /dev/null; then
        rescan-scsi-bus.sh -r | tail -n 3
    fi
}

# 초기 answers.conf.setup 파일을 생성하며 기본 설정 값을 작성
task_answers.conf() {
	cat << ANSWERS.CONF_EOF > /etc/ovirt-hosted-engine/answers.conf.setup
[environment:default]
OVEHOSTED_CORE/HE_OFFLINE_DEPLOYMENT=bool:True
OVEHOSTED_CORE/deployProceed=bool:True
OVEHOSTED_CORE/enableKeycloak=bool:False
OVEHOSTED_CORE/forceIpProceed=none:None
OVEHOSTED_CORE/screenProceed=bool:True
OVEHOSTED_ENGINE/clusterName=str:Default
OVEHOSTED_ENGINE/datacenterName=str:Default
OVEHOSTED_ENGINE/enableHcGlusterService=none:None
OVEHOSTED_ENGINE/insecureSSL=none:None
OVEHOSTED_ENGINE/adminPassword=str:admin!123
OVEHOSTED_NETWORK/bridgeName=str:ovirtmgmt
OVEHOSTED_NETWORK/network_test=str:ping
OVEHOSTED_NETWORK/network_test_tcp_address=none:None
OVEHOSTED_NETWORK/network_test_tcp_port=none:None
OVEHOSTED_NOTIF/destEmail=str:root@localhost
OVEHOSTED_NOTIF/smtpPort=str:25
OVEHOSTED_NOTIF/smtpServer=str:localhost
OVEHOSTED_NOTIF/sourceEmail=str:root@localhost
OVEHOSTED_STORAGE/discardSupport=bool:False
OVEHOSTED_STORAGE/iSCSIPortalUser=str:none:None
OVEHOSTED_STORAGE/imgSizeGB=str:185
OVEHOSTED_VM/vmDiskSizeGB=str:185
OVEHOSTED_STORAGE/lockspaceImageUUID=none:None
OVEHOSTED_STORAGE/lockspaceVolumeUUID=none:None
OVEHOSTED_STORAGE/metadataImageUUID=none:None
OVEHOSTED_STORAGE/metadataVolumeUUID=none:None
OVEHOSTED_STORAGE/storageDomainName=str:hosted_storage
OVEHOSTED_VM/OpenScapProfileName=none:None
OVEHOSTED_VM/applyOpenScapProfile=bool:False
OVEHOSTED_VM/automateVMShutdown=bool:True
OVEHOSTED_VM/cloudinitRootPwd=str:adminRoot!@#
OVEHOSTED_VM/cloudInitISO=str:generate
OVEHOSTED_VM/cloudinitExecuteEngineSetup=bool:True
OVEHOSTED_VM/cloudinitVMDNS=str:
OVEHOSTED_VM/cloudinitVMETCHOSTS=bool:True
OVEHOSTED_VM/cloudinitVMTZ=str:Asia/Seoul
OVEHOSTED_VM/emulatedMachine=str:pc
OVEHOSTED_VM/enableFips=bool:False
OVEHOSTED_VM/ovfArchive=str:
OVEHOSTED_VM/rootSshAccess=str:yes
OVEHOSTED_VM/rootSshPubkey=str:
OVEHOSTED_VM/vmCDRom=none:None
OVEHOSTED_VM/vmMemSizeMB=int:16384
OVEHOSTED_VM/vmVCpus=str:6
OVEHOSTED_NETWORK/host_name=str:hostname_value
OVEHOSTED_NETWORK/bridgeIf=str:bridgeIf_value
OVEHOSTED_NETWORK/gateway=str:gateway_value
OVEHOSTED_NETWORK/fqdn=str:fqdn_value
OVEHOSTED_VM/cloudinitInstanceDomainName=str:cloudinitInstanceDomainName_value
OVEHOSTED_VM/cloudinitInstanceHostName=str:cloudinitInstanceHostName_value
OVEHOSTED_VM/cloudinitVMStaticCIDR=str:cloudinitVMStaticCIDR_value
ANSWERS.CONF_EOF
}

# answers.conf.setup 파일에 추가 설정 값을 업데이트하고, 사용자 입력을 통해 네트워크, 호스트, IP, 브릿지 등 값을 수정
task_answers.conf_nfs_fc_iscsi() {
    # Python 스크립트를 이용해 무작위 MAC 주소 생성
	MAC_ADDR=$(python3 -c "from ovirt_hosted_engine_setup import util as ohostedutil; print(ohostedutil.randomMAC())")
	# 생성된 MAC 주소를 설정 파일에 추가
	echo "OVEHOSTED_VM/vmMACAddr=str:$MAC_ADDR" | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null

	# 현재 시스템의 호스트 이름을 가져와 설정 파일 내 기본값 대체
	current_hostname=$(hostname)
	sed -i "s/OVEHOSTED_NETWORK\/host_name=str:hostname_value/OVEHOSTED_NETWORK\/host_name=str:${current_hostname}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
	sed -i "s/OVEHOSTED_VM\/cloudinitInstanceHostName=str:cloudinitInstanceHostName_value/OVEHOSTED_VM\/cloudinitInstanceHostName=str:${current_hostname}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
	echo
    echo "- Engine Settings"
	# 사용자에게 엔진 VM 호스트 이름(fqdn)을 입력받음
	while true; do
	    echo -n "> Engine VM Hostname: "
	    read fqdn
	    if [ -n "$fqdn" ]; then
	        sed -i "s/OVEHOSTED_NETWORK\/fqdn=str:fqdn_value/OVEHOSTED_NETWORK\/fqdn=str:${fqdn}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
	        break
	    else
	        echo "[WARNING] The hostname cannot be empty. Enter a valid hostname."
	    fi
	done
    
	# 사용자에게 엔진 VM IP 주소 입력받음; 올바른 IP 형식인지 확인
    # 1. 현재 호스트 이름 추출
    hostname=$(hostname)
    
    # 2. /etc/hosts에서 호스트 이름과 일치하는 줄에서 IP 추출
    prefix_ip=$(grep -w "$hostname" /etc/hosts \
                 | awk '{print $1}' \
                 | head -n1)
    
    # 3. IP가 유효한 경우 앞 3옥텟만 추출 (예: 192.168.0.)
    prefix_ip="${prefix_ip%.*}."
    
    # 4. 사용자로부터 Engine IP 주소 입력 받기
    while true; do
        read -e -i "${prefix_ip%.*}." -p "> Engine IP Address: " engine_ip
        engine_ip=${engine_ip:-${prefix_ip%.*}.}
    
        if valid_ip "$engine_ip"; then
            cloudinitVMStaticCIDR="$engine_ip"
            break
        else
            echo "[WARNING] Invalid IP address. Please re-enter."
        fi
    done
    
    # 5. 설정 파일에서 해당 값을 교체
    sed -i "s|OVEHOSTED_VM/cloudinitVMStaticCIDR=str:cloudinitVMStaticCIDR_value|OVEHOSTED_VM/cloudinitVMStaticCIDR=str:${cloudinitVMStaticCIDR}|g" /etc/ovirt-hosted-engine/answers.conf.setup
    sed -i "s|OVEHOSTED_VM/cloudinitInstanceDomainName=str:cloudinitInstanceDomainName_value|OVEHOSTED_VM/cloudinitInstanceDomainName=str:${cloudinitVMStaticCIDR}|g" /etc/ovirt-hosted-engine/answers.conf.setup \
    | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null

	# 6. /etc/hosts 파일에서 해당 IP 또는 호스트 이름 항목이 존재하면 삭제 후 새롭게 추가
	if grep -q "^$cloudinitVMStaticCIDR" /etc/hosts; then
	    sed -i "/^$cloudinitVMStaticCIDR /d" /etc/hosts
	fi
	if grep -q " $fqdn$" /etc/hosts; then
	    sed -i "/ $fqdn$/d" /etc/hosts
	fi
	echo "$cloudinitVMStaticCIDR    $fqdn" | tee -a /etc/hosts > /dev/null
  
    # 1) bond 장치가 하나인지 검사하여, 하나일 땐 자동 설정만 수행
    mapfile -t bond_devs < <(nmcli -t -f DEVICE device | grep -E '^bond')
    if [ "${#bond_devs[@]}" -eq 1 ]; then
        bridgeIf="${bond_devs[0]}"
        # 선택한 NIC로 설정 파일 내 기본값 치환
        sed -i "s|OVEHOSTED_NETWORK/bridgeIf=str:bridgeIf_value|OVEHOSTED_NETWORK/bridgeIf=str:${bridgeIf}|g" \
            /etc/ovirt-hosted-engine/answers.conf.setup
    else
        # 2) bond 장치가 여러 개이거나 없으면 NIC 목록 출력 및 사용자 입력
        
        # 열 너비 설정
        col1_width=11; col2_width=14; col3_width=20
        col4_width=11; col5_width=11; col6_width=20
        echo
        echo "- NIC port available for bridge"
        echo "┌───────────┬──────────────┬────────────────────┬───────────┬───────────┬────────────────────┐"
        printf "│%-${col1_width}s│%-${col2_width}s│%-${col3_width}s│%-${col4_width}s│%-${col5_width}s│%-${col6_width}s│\n" \
            "DEVICE" "STATE" "CONNECTION" "SPEED" "DUPLEX" "IP"
        echo "├───────────┼──────────────┼────────────────────┼───────────┼───────────┼────────────────────┤"
    
        # (1) 인터페이스 목록 한 번만 가져오기
        mapfile -t device_list < <(
            nmcli -t -f DEVICE device \
                | grep -Ev 'lo|virbr|br-int|vdsmdummy|ip_vti|ovirtmgmt|bondscan|vnet'
        )
    
        # (2) nmcli 출력 캐싱 (DEVICE:STATE:CONNECTION)
        declare -A state_map connection_map ip_map
        while IFS=: read -r dev state conn; do
            state_map[$dev]=$state
            connection_map[$dev]=$conn
        done < <(nmcli -t -f DEVICE,STATE,CONNECTION device)
    
        # (3) ip -br -o address 출력 캐싱 (DEVICE + IPv4/CIDR)
        while read -r dev _ addr; do
            ip_map[$dev]=$addr
        done < <(ip -br -o -4 address)
    
        # (4) 루프 돌며 배열 조회 + ethtool 호출 최소화
        for dev in "${device_list[@]}"; do
            state=${state_map[$dev]:-DOWN}
            conn=${connection_map[$dev]:---}
            ip4=${ip_map[$dev]:-}
    
            # ethtool 호출 예외 처리 추가
            if ethtool "$dev" &>/dev/null; then
                read -r speed duplex < <(
                    ethtool "$dev" | awk -F': ' '
                        /Speed/  { gsub(/Mb\/s/,"",$2); speed=$2 }
                        /Duplex/ { duplex=$2; }
                        END { print speed, duplex }
                    '
                )
            else
                speed="N/A"
                duplex="N/A"
            fi
    
            speed=${speed%%!*}
            duplex=${duplex%%!*}
    
            printf "│%-${col1_width}s│%-${col2_width}s│%-${col3_width}s│%-${col4_width}s│%-${col5_width}s│%-${col6_width}s│\n" \
                "$dev" "$state" "$conn" "$speed" "$duplex" "$ip4"
        done
    
        echo "└───────────┴──────────────┴────────────────────┴───────────┴───────────┴────────────────────┘"
        echo
    
        # answers.conf.setup 에 bridgeIf 값을 설정하는 부분
        while true; do
            default_bridge="bond0"
            read -e -i "$default_bridge" -p "> Specify the NIC on which to configure the RutilVM bridge. (Default: ${default_bridge}): " bridgeIf
            bridgeIf=${bridgeIf:-$default_bridge}
    
            device_list=$(nmcli -t -f DEVICE device | grep -Ev 'lo|virbr')
            if [[ $device_list =~ (^|[[:space:]])$bridgeIf($|[[:space:]]) ]]; then
                sed -i "s|OVEHOSTED_NETWORK/bridgeIf=str:bridgeIf_value|OVEHOSTED_NETWORK/bridgeIf=str:${bridgeIf}|g" \
                    /etc/ovirt-hosted-engine/answers.conf.setup
                break
            else
                echo "[WARNING] Invalid device. Enter a valid device name."
            fi
        done
    fi

	# 게이트웨이 자동 조회 및 사용자 입력 처리
    while true; do
        # 1) 자동 조회
        gateway=$(ip route | grep default | awk '{print $3}' || true)
    
        # 2) 조회 결과가 비어 있거나, 형식이 올바르지 않으면 사용자 입력으로 대체
        if [[ -z "$gateway" ]] || ! valid_ip "$gateway"; then
            echo "[WARNING] Default gateway not found or invalid."
            read -p "> Gateway IP Address: " gateway
        fi
    
        # 3) 다시 검사: 반드시 비어 있지 않고, 유효한 IP여야 함
        if [[ -z "$gateway" ]]; then
            echo "[WARNING] Gateway cannot be empty."
            continue
        fi
        if ! valid_ip "$gateway"; then
            echo "[WARNING] '$gateway' is not a valid IPv4 or IPv6 address."
            continue
        fi
    
        # 4) 최종 반영
        sed -i "s|OVEHOSTED_NETWORK/gateway=str:gateway_value|OVEHOSTED_NETWORK/gateway=str:${gateway}|g" \
            /etc/ovirt-hosted-engine/answers.conf.setup \
            | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
    
        break
    done
}

# 사용자가 선택한 스토리지 타입(fc, nfs, iscsi)에 따라 answers.conf.setup 파일에
# 필요한 설정을 추가하고, 추가 입력을 받아 적절한 LUN 또는 NFS/iscsi 설정을 적용하는 함수임
task_answers.conf_storage_type() {
    echo "- Storage"
	# 무한 루프: 사용자가 올바른 스토리지 타입을 입력할 때까지 반복
	while true; do
		# 사용자에게 사용할 스토리지 타입을 입력 받음
		echo -n "> Storage Type (fc, nfs, iscsi): "
		read -r engine_storage
		# 입력된 스토리지 타입에 따른 처리
		case $engine_storage in
			# 1) fc (Fibre Channel) 선택 시
            fc)
                # ──────────────────────────────────────────────
                # fc(파이버 채널) 스토리지용 기본 설정을 answers.conf.setup 파일에 추가
                # ──────────────────────────────────────────────
                cat << ANSWERS.CONF_FC_EOF >> /etc/ovirt-hosted-engine/answers.conf.setup
OVEHOSTED_STORAGE/connectionTimeout=int:180
OVEHOSTED_STORAGE/multipathSupport=bool:True
OVEHOSTED_STORAGE/pathPolicy=str:multibus
OVEHOSTED_STORAGE/failoverTimeout=int:60
OVEHOSTED_STORAGE/storageDomainConnection=none:None
OVEHOSTED_STORAGE/domainType=str:fc
OVEHOSTED_STORAGE/lunDetectType=str:fc
OVEHOSTED_STORAGE/fcPaths=int:2
OVEHOSTED_STORAGE/nfsVersion=str:auto
OVEHOSTED_STORAGE/iSCSIDiscoverUser=none:None
OVEHOSTED_STORAGE/iSCSIPortal=none:None
OVEHOSTED_STORAGE/iSCSIPortalIPAddress=none:None
OVEHOSTED_STORAGE/iSCSIPortalPort=none:None
OVEHOSTED_STORAGE/iSCSITargetName=none:None
OVEHOSTED_STORAGE/mntOptions=str:
OVEHOSTED_STORAGE/LunID=str:LunID_value
ANSWERS.CONF_FC_EOF

                # ──────────────────────────────────────────────
                # LUN 선택을 위한 메인 루프 시작
                # (올바른 LUN을 고를 때까지 반복)
                # ──────────────────────────────────────────────
                while true; do
                    # ─── [1] 현재 LUN 목록 스캔 ───
                    task_lun_scan  # 시스템에 연결된 FC LUN들을 새로 스캔
                    task_multipath # 멀티패스가 비활성화 상태이면 활성화
            
                    # multipath를 이용해 현재 스캔된 LUN 리스트 가져오기
                    if [ ! -f /etc/multipath.conf ]; then
                    #    echo "[WARNING] /etc/multipath.conf not found. Multipath not enabled."
                        multipath_output=""
                    else
                        multipath_output=$(multipath -ll 2>/dev/null)
                        if [ $? -ne 0 ]; then
                    #        echo "[WARNING] Failed to execute multipath -ll. Skipping LUN detection."
                            multipath_output=""
                        fi
                    fi
            
                    # LUN 목록을 저장할 배열 초기화
                    declare -a lun_list
            
                    # 각 LUN 정보를 저장할 변수 초기화
                    LunID_value=""
                    size=""
                    target_char=""
                    target_name=""
                    active_count=0
            
                    # ─── [2] multipath 출력 파싱 ───
                    prev_line=""
                    while IFS= read -r line; do
                        # (a) size= 줄이면, 바로 위 줄에서 WWID 및 관련 정보 추출
                        if [[ $line =~ size= ]]; then
                            LunID_value=$(echo "$prev_line" | awk '{print $1}')
                            size=$(echo "$line" | grep -oP 'size=\K[^ ]+')
                            target_char=$(echo "$prev_line" | awk '{print $2}')
                            target_name=$(echo "$prev_line" | cut -d' ' -f3-)
                            active_count=0
                        fi
                
                        # (b) 활성 경로(active path) 개수 세기
                        if [[ $line =~ ^\|- || $line =~ ^\`- ]]; then
                            active_count=$((active_count + 1))
                        fi
                
                        # (c) LUN 정보 수집 완료 시 배열에 저장
                        if [[ $line =~ ^\`- ]]; then
                            lun_list+=("$LunID_value;$size;$target_char;$target_name;$active_count")
                        fi
                
                        # 다음 라인을 위해 저장
                        prev_line="$line"
                    done <<< "$multipath_output"
            
                    # ──────────────────────────────────────────────
                    # [3] LUN 목록이 없는 경우
                    # ──────────────────────────────────────────────
                    if [ ${#lun_list[@]} -eq 0 ]; then
                        # 스캔된 LUN이 없으면 사용자에게 다시 스캔할지, 종료할지 물어봄
                        while true; do
                            echo
                            echo "No LUNs available for selection."
                            echo "1) LUN rescan"
                            echo "2) Exit"
                            echo -n "Select an action (1 or 2): "
                            read -r user_choice
            
                            if [ "$user_choice" == "1" ]; then
                                # 1을 누르면 LUN 스캔 다시 수행
                                task_lun_scan
                                continue 2   # 상위 while 루프로 재시작
                            elif [ "$user_choice" == "2" ]; then
                                # 2를 누르면 설치 중단
                                echo "Aborts installation."
                                exit 0
                            else
                                # 그 외 입력은 다시 질문
                                echo
                                echo "Invalid input. Try 1 or 2."
                            fi
                        done
            
                    else
                        # ──────────────────────────────────────────────
                        # [4] LUN 목록이 존재하는 경우
                        # ──────────────────────────────────────────────
                        echo "The following LUNs have been found on the requested target:"
                        index=1  # 표시용 인덱스 초기화
            
                        # 스캔된 LUN 리스트를 출력
                        for lun in "${lun_list[@]}"; do
                            IFS=';' read -r LunID_value size target_char target_name path_count <<< "$lun"
                            printf "[%d]     %-35s %-5s %-10s %-20s\n" "$index" "$LunID_value" "$size" "$target_char" "$target_name"
                            printf "                                     paths: %d active\n" "$path_count"
                            ((index++))
                        done
                        echo ""
         
                        # ──────────────────────────────────────────────
                        # [5] 사용자로부터 LUN 번호 입력 받기
                        # ──────────────────────────────────────────────
                        while true; do
                            echo -n "Select the target LUN (1 to $((index-1))): "
                            read -r selected_lun
            
                            # 입력값이 숫자이고, 유효한 범위(1 ~ index-1) 안이면
                            if [[ "$selected_lun" =~ ^[0-9]+$ ]] && ((selected_lun >= 1 && selected_lun <= index - 1)); then
                                # 올바른 선택
                                selected_lun_info="${lun_list[$selected_lun-1]}"
                                IFS=';' read -r LunID_value size target_char target_name path_count <<< "$selected_lun_info"
            
                                # 선택한 LUN ID를 answers.conf.setup 파일에 반영
                                sed -i "s/OVEHOSTED_STORAGE\/LunID=str:LunID_value/OVEHOSTED_STORAGE\/LunID=str:${LunID_value}/g" /etc/ovirt-hosted-engine/answers.conf.setup
            
                                break 2  # 전체 while 루프(메인) 탈출
                            else
                                # 잘못된 입력값이면 다시 입력 요청
                                echo "[WARNING] Invalid LUN selection. Try again."
                            fi
                        done
                    fi
                done
            
                # ──────────────────────────────────────────────
                # [6] fc 처리 완료 후 case 블록 종료
                # ──────────────────────────────────────────────
                break
                ;;

			# 2) nfs 선택 시
			nfs)
				# nfs용 기본 설정을 answers.conf.setup 파일 끝에 추가
				cat << ANSWERS.CONF_NFS_EOF >> /etc/ovirt-hosted-engine/answers.conf.setup
OVEHOSTED_STORAGE/LunID=none:None
OVEHOSTED_STORAGE/domainType=str:nfs
OVEHOSTED_STORAGE/iSCSIDiscoverUser=none:None
OVEHOSTED_STORAGE/iSCSIPortal=none:None
OVEHOSTED_STORAGE/iSCSIPortalIPAddress=none:None
OVEHOSTED_STORAGE/iSCSIPortalPort=none:None
OVEHOSTED_STORAGE/iSCSITargetName=none:None
OVEHOSTED_STORAGE/mntOptions=str:
OVEHOSTED_STORAGE/nfsVersion=str:auto
OVEHOSTED_STORAGE/storageDomainConnection=str:nfs_ip:nfs_storage_path
ANSWERS.CONF_NFS_EOF

				# 무한 루프: 올바른 NFS 서버 IP와 마운트 경로를 입력받을 때까지 반복
				while true; do
					echo -n "> NFS server IP Address: "
					read nfs_server_ip
					# IP 유효성 검사를 위한 함수 호출(valid_ip)
					if valid_ip "$nfs_server_ip"; then
						# showmount 명령으로 NFS 서버의 내보내기(export) 목록을 가져옴(첫 번째 라인 제외)
						output=$(showmount -e "$nfs_server_ip" | sed 1d)
						# 출력 결과가 없으면 NFS 서버로부터 응답이 없음을 알림
						if [ -z "$output" ]; then
                            echo
							echo "No response from NFS server. Check your IP or try again."
							# 재시도 또는 종료 옵션 제공
							while true; do
								echo "1) Retry"
								echo "2) Exit"
								read -p "Select (1 or 2): " retry_choice
								case $retry_choice in
									1)
										break
										;;
									2)
                                        echo "Aborts installation."
										exit 0
										;;
									*)
                                        echo
										echo "Invalid input. Try 1 or 2."
										;;
								esac
							done
							[[ $retry_choice -eq 1 ]] || break
							continue
						fi

                        # 내보내기 목록을 배열로 저장
                        IFS=$'\n' mounts=($output)
                        
                        for i in "${!mounts[@]}"; do
                            echo "[$((i+1))] ${mounts[$i]}"
                        done
                        
                        # 사용자에게 선택 입력을 받을 때 목록 외에는 재입력, 'n' 또는 'no' 입력 시 스크립트 종료
                        while true; do
                            read -p "Select NFS mount path [1-${#mounts[@]}] or type 'n' to exit: " choice
                        
                            # 'n' 또는 'no' 입력 시 스크립트 완전 종료
                            if [[ "$choice" =~ ^[nN]([oO])?$ ]]; then
                                echo "Aborts installation."
                                exit 0
                            fi
                        
                            # 숫자 입력인지, 그리고 범위(1~${#mounts[@]}) 안에 있는지 확인
                            if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= ${#mounts[@]} )); then
                                idx=$(( choice - 1 ))
                                nfs_storage_path=$(awk '{print $1}' <<< "${mounts[$idx]}")
                                break
                            fi
                        
                            echo "[WARNING] Invalid input. Enter a number between 1 and ${#mounts[@]}, or 'n' to exit."
                        done
						# answers.conf.setup 파일 내 nfs_ip와 nfs_storage_path 기본값을 실제 값으로 치환
						sed -i "s|nfs_ip|$nfs_server_ip|; s|nfs_storage_path|$nfs_storage_path|" /etc/ovirt-hosted-engine/answers.conf.setup
						break
					else
						echo "[WARNING] Invalid IP address. Check the IP address and try again."
					fi
				done
				# nfs 선택 처리 완료 시 무한 루프 종료
				break
				;;
			# 3) iscsi 선택 시
			iscsi)
				# iscsi용 기본 설정을 answers.conf.setup 파일 끝에 추가
				cat << ANSWERS.CONF_iSCSI_EOF >> /etc/ovirt-hosted-engine/answers.conf.setup
OVEHOSTED_STORAGE/connectionTimeout=int:180
OVEHOSTED_STORAGE/multipathSupport=bool:true
OVEHOSTED_STORAGE/pathPolicy=str:multibus
OVEHOSTED_STORAGE/failoverTimeout=int:60
OVEHOSTED_STORAGE/storageDomainConnection=none:None
OVEHOSTED_STORAGE/domainType=str:iscsi
OVEHOSTED_STORAGE/lunDetectType=str:iscsi
OVEHOSTED_STORAGE/iSCSIPortal=str:1
OVEHOSTED_STORAGE/iSCSIPortalPort=str:3260
OVEHOSTED_STORAGE/iSCSIPortalPassword=str:none:None
OVEHOSTED_STORAGE/mntOptions=none:None
OVEHOSTED_STORAGE/iSCSIPortalIPAddress=str:iSCSIPortalIPAddress_value
OVEHOSTED_STORAGE/iSCSIDiscoverUser=str:iSCSIDiscoverUser_value
OVEHOSTED_STORAGE/iSCSIDiscoverPassword=str:iSCSIDiscoverPassword_value
OVEHOSTED_STORAGE/iSCSITargetName=str:iSCSITargetName_value
OVEHOSTED_STORAGE/hostedEngineLUNID=str:LunID_value
OVEHOSTED_STORAGE/LunID=str:LunID_value
ANSWERS.CONF_iSCSI_EOF

				# iSCSI의 추가 정보 입력: discover user 및 password
				echo
				echo -n "> iSCSI discover user: "
				read iSCSIDiscoverUser
				sed -i "s/OVEHOSTED_STORAGE\/iSCSIDiscoverUser=str:iSCSIDiscoverUser_value/OVEHOSTED_STORAGE\/iSCSIDiscoverUser=str:${iSCSIDiscoverUser}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
				echo
				echo -n "> iSCSI discover password: "
				read iSCSIDiscoverPassword
				sed -i "s/OVEHOSTED_STORAGE\/iSCSIDiscoverPassword=str:iSCSIDiscoverPassword_value/OVEHOSTED_STORAGE\/iSCSIDiscoverPassword=str:${iSCSIDiscoverPassword}/g" /etc/ovirt-hosted-engine/answers.conf.setup | tee -a /etc/ovirt-hosted-engine/answers.conf.setup > /dev/null
				echo

                # ──────────────────────────────────────────────
                # iSCSI Portal IP 주소 입력받고, 유효성 검사
                # ──────────────────────────────────────────────
                while true; do
                    echo
                    echo -n "> iSCSI portal IP Address: "
                    read iSCSIPortalIPAddress
                    if valid_ip "$iSCSIPortalIPAddress"; then
                        sed -i "s/OVEHOSTED_STORAGE\/iSCSIPortalIPAddress=str:iSCSIPortalIPAddress_value/OVEHOSTED_STORAGE\/iSCSIPortalIPAddress=str:${iSCSIPortalIPAddress}/g" /etc/ovirt-hosted-engine/answers.conf.setup
                        break
                    else
                        echo "[WARNING] Invalid IP address. Enter a valid IP address."
                    fi
                done
            
                # iscsiadm 명령으로 Target 검색
                DISCOVERY_OUTPUT=$(iscsiadm -m discovery -t sendtargets -p "$iSCSIPortalIPAddress" -P 1 2>/dev/null)
                TARGETS=($(echo "$DISCOVERY_OUTPUT" | grep -oP '(?<=Target: ).+'))
            
                if [ ${#TARGETS[@]} -eq 0 ]; then
                    echo "[ INFO  ] No iSCSI targets found for IP address $iSCSIPortalIPAddress."
                    exit 1
                fi
            
                # Target 목록 출력
                echo
                echo "The following targets have been found:"
                for i in "${!TARGETS[@]}"; do
                    echo "[$((i+1))]     ${TARGETS[$i]}"
                done
                echo
            
                # Target 선택 (올바른 번호만 허용)
                while true; do
                    read -p "Select a target (1 to ${#TARGETS[@]}): " SELECTION
                    if [[ "$SELECTION" =~ ^[0-9]+$ ]] && [ "$SELECTION" -ge 1 ] && [ "$SELECTION" -le ${#TARGETS[@]} ]; then
                        iSCSITargetName="${TARGETS[$((SELECTION-1))]}"
                        sed -i "s/OVEHOSTED_STORAGE\/iSCSITargetName=str:iSCSITargetName_value/OVEHOSTED_STORAGE\/iSCSITargetName=str:${iSCSITargetName}/g" /etc/ovirt-hosted-engine/answers.conf.setup
                        break
                    else
                        echo "[WARNING] Invalid target selection. Enter a number between 1 and ${#TARGETS[@]}."
                    fi
                done

                # ──────────────────────────────────────────────
                # LUN 선택을 위한 메인 루프 시작
                # (올바른 LUN을 고를 때까지 반복)
                # ──────────────────────────────────────────────
                while true; do
                    # ─── [1] 현재 LUN 목록 스캔 ───
                    task_lun_scan  # 시스템에 연결된 FC LUN들을 새로 스캔
                    task_multipath # 멀티패스가 비활성화 상태이면 활성화
            
                    # multipath를 이용해 현재 스캔된 LUN 리스트 가져오기
                    if [ ! -f /etc/multipath.conf ]; then
                    #    echo "[WARNING] /etc/multipath.conf not found. Multipath not enabled."
                        multipath_output=""
                    else
                        multipath_output=$(multipath -ll 2>/dev/null)
                        if [ $? -ne 0 ]; then
                    #        echo "[WARNING] Failed to execute multipath -ll. Skipping LUN detection."
                            multipath_output=""
                        fi
                    fi
            
                    # LUN 목록을 저장할 배열 초기화
                    declare -a lun_list
            
                    # 각 LUN 정보를 저장할 변수 초기화
                    LunID_value=""
                    size=""
                    target_char=""
                    target_name=""
                    active_count=0
            
                    # ─── [2] multipath 출력 파싱 ───
                    prev_line=""
                    while IFS= read -r line; do
                        # (a) size= 줄이면, 바로 위 줄에서 WWID 및 관련 정보 추출
                        if [[ $line =~ size= ]]; then
                            LunID_value=$(echo "$prev_line" | awk '{print $1}')
                            size=$(echo "$line" | grep -oP 'size=\K[^ ]+')
                            target_char=$(echo "$prev_line" | awk '{print $2}')
                            target_name=$(echo "$prev_line" | cut -d' ' -f3-)
                            active_count=0
                        fi
                
                        # (b) 활성 경로(active path) 개수 세기
                        if [[ $line =~ ^\|- || $line =~ ^\`- ]]; then
                            active_count=$((active_count + 1))
                        fi
                
                        # (c) LUN 정보 수집 완료 시 배열에 저장
                        if [[ $line =~ ^\`- ]]; then
                            lun_list+=("$LunID_value;$size;$target_char;$target_name;$active_count")
                        fi
                
                        # 다음 라인을 위해 저장
                        prev_line="$line"
                    done <<< "$multipath_output"
            
                    # ──────────────────────────────────────────────
                    # [3] LUN 목록이 없는 경우
                    # ──────────────────────────────────────────────
                    if [ ${#lun_list[@]} -eq 0 ]; then
                        # 스캔된 LUN이 없으면 사용자에게 다시 스캔할지, 종료할지 물어봄
                        while true; do
                            echo
                            echo "No LUNs available for selection."
                            echo "1) LUN rescan"
                            echo "2) Exit"
                            echo -n "Select an action (1 or 2): "
                            read -r user_choice
            
                            if [ "$user_choice" == "1" ]; then
                                # 1을 누르면 LUN 스캔 다시 수행
                                task_lun_scan
                                continue 2   # 상위 while 루프로 재시작
                            elif [ "$user_choice" == "2" ]; then
                                # 2를 누르면 설치 중단
                                echo "Aborts installation."
                                exit 0
                            else
                                # 그 외 입력은 다시 질문
                                echo
                                echo "Invalid input. Try 1 or 2."
                            fi
                        done
            
                    else
                        # ──────────────────────────────────────────────
                        # [4] LUN 목록이 존재하는 경우
                        # ──────────────────────────────────────────────
                        echo "The following LUNs have been found on the requested target:"
                        index=1  # 표시용 인덱스 초기화
            
                        # 스캔된 LUN 리스트를 출력
                        for lun in "${lun_list[@]}"; do
                            IFS=';' read -r LunID_value size target_char target_name path_count <<< "$lun"
                            printf "[%d]     %-35s %-5s %-10s %-20s\n" "$index" "$LunID_value" "$size" "$target_char" "$target_name"
                            printf "                                     paths: %d active\n" "$path_count"
                            ((index++))
                        done
                        echo ""
         
                        # ──────────────────────────────────────────────
                        # [5] 사용자로부터 LUN 번호 입력 받기
                        # ──────────────────────────────────────────────
                        while true; do
                            echo -n "Select the target LUN (1 to $((index-1))): "
                            read -r selected_lun
            
                            # 입력값이 숫자이고, 유효한 범위(1 ~ index-1) 안이면
                            if [[ "$selected_lun" =~ ^[0-9]+$ ]] && ((selected_lun >= 1 && selected_lun <= index - 1)); then
                                # 올바른 선택
                                selected_lun_info="${lun_list[$selected_lun-1]}"
                                IFS=';' read -r LunID_value size target_char target_name path_count <<< "$selected_lun_info"
            
                                # 선택한 LUN ID를 answers.conf.setup 파일에 반영
                                sed -i "s/OVEHOSTED_STORAGE\/LunID=str:LunID_value/OVEHOSTED_STORAGE\/LunID=str:${LunID_value}/g" /etc/ovirt-hosted-engine/answers.conf.setup
            
                                break 2  # 전체 while 루프(메인) 탈출
                            else
                                # 잘못된 입력값이면 다시 입력 요청
                                echo "[WARNING] Invalid LUN selection. Try again."
                            fi
                        done
                    fi
                done
                break
                ;;
            # 기본(잘못된 입력) 분기 추가
            *)
                echo "[WARNING] Invalid storage type. Enter fc, nfs, or iscsi."
                ;;
		esac
	done
}

# 현재까지 구성된 설치 설정을 미리 보여주고, 사용자가 최종 설치 여부를 확인
task_configuration_preview() {
	while true; do
		# 미리보기 헤더 출력
        echo "─────────────────────────────────── CONFIGURATION PREVIEW ───────────────────────────────────"
		# 각 설정 항목을 출력 (fqdn, cloudinitVMStaticCIDR, gateway, bridge interface, 스토리지 연결 정보 등)
		echo "Engine VM Hostname                 : "$fqdn
		echo "Engine VM IP                       : "$cloudinitVMStaticCIDR
		echo "Gateway address                    : "$gateway
		echo "Bridge interface                   : "$bridgeIf "($MAC_ADDR)"
		echo "Storage connection                 : "$engine_storage
		# 스토리지 타입에 따라 추가 정보를 출력
		case $engine_storage in
			fc)
				echo "                                     $LunID_value"
				echo "                                     $size"
				;;
			iscsi)
				echo "                                     $TARGETS"
				echo "                                     $LunID_value"
				echo "                                     $size"
				;;
			nfs)
				echo "                                     $nfs_server_ip"
				echo "                                     $nfs_storage_path"
				;;
			*)
				;;
		esac
        echo "─────────────────────────────────────────────────────────────────────────────────────────────"
		echo
		# 사용자에게 최종 설치 설정 확인 입력 받음
		read -p "> Please confirm installation settings (Yes, No): " confirm_installation_yn
		# 사용자 입력에 따라 처리: yes면 루프 종료, no면 함수 종료(반환 값 1)
		case $confirm_installation_yn in
			yes|YES|y|Y|Yes)
				break
				;;
			no|NO|n|N|No)
                echo "[ INFO  ] Stage: Termination"
                echo "Aborts installation."
				exit 0
				;;
			*)
				echo "[WARNING] Invalid input. Enter 'y' for yes or 'n' for no."
                echo
				;;
		esac
	done
}

# ───────────────────────────────────────────────────────────────────
# 함수 호출 순서
task_answers.conf
task_answers.conf_nfs_fc_iscsi
echo
task_answers.conf_storage_type
echo
task_configuration_preview
# ───────────────────────────────────────────────────────────────────

# 만약 task_configuration_preview 명령어의 종료 상태가 1이면 반복문이나 스크립트를 종료
if [[ $? -eq 1 ]]; then
	exit 1
fi

# ovirt-engine-appliance 패키지가 설치되어 있는지 확인
if ! dnf list installed ovirt-engine-appliance &> /dev/null; then
    rpm_file=$(dnf --quiet repoquery --location ovirt-engine-appliance | sed 's|^file://||' | tail -n 1)
    
    if [[ -n "$rpm_file" && -f "$rpm_file" ]]; then
        echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Install the RutilVM engine package]"
        dnf install -y ovirt-engine-appliance >/dev/null 2>&1

        if dnf list installed ovirt-engine-appliance &> /dev/null; then
            echo "[ INFO  ] RutilVM engine package installation done."
        else
            echo "[WARNING] RutilVM engine package installation failed"
            echo "Aborts installation."
            exit 1
        fi
    else
        echo "[WARNING] The RutilVM engine package is not available in the repository"
        echo "Aborts installation."
        exit 1
    fi
fi

echo

# 현재 타임스탬프를 YYYYMMDDHHMMSS 형식으로 저장
timestamp=$(date +%Y%m%d%H%M%S)

# 기존의 answers.conf 파일이 존재하면 백업 처리
if [ -f /etc/ovirt-hosted-engine/answers.conf ]; then
	# 기존 파일을 타임스탬프가 포함된 이름으로 이동(백업)
	mv /etc/ovirt-hosted-engine/answers.conf /etc/ovirt-hosted-engine/answers.conf.$timestamp
	# 백업 실패 시 경고 메시지 출력 후 종료
	if [ $? -ne 0 ]; then
		echo "[WARNING] Failed to create backup of answers.conf" >&2
		exit 1
	fi
fi

# 새 설정 파일을 원본 파일 위치에 복사
cp /etc/ovirt-hosted-engine/answers.conf.setup /etc/ovirt-hosted-engine/answers.conf
# 복사 실패 시 경고 메시지 출력 후 종료
if [ $? -ne 0 ]; then
	echo "[WARNING] Failed to copy answers.conf" >&2
	exit 1
fi

# 날짜 및 시간을 포함한 로그 파일 이름 생성
LOG_FILE="/tmp/rutilvm-engine-setup_${timestamp}.log"

# 스크립트 종료 시 로그 파일을 삭제하도록 trap 등록 (oVirt 자체 로그 화면 출력 미사용 시)
#trap 'rm -f "$LOG_FILE"' EXIT

# engine-logs 디렉터리 생성 및 기존 로그 이동
# 로그 디렉토리 생성 (없을 경우)
[ ! -d /var/log/ovirt-hosted-engine-setup/engine-logs ] && mkdir -p /var/log/ovirt-hosted-engine-setup/engine-logs

# .log 파일이 하나라도 있을 경우에만 이동
if ls /var/log/ovirt-hosted-engine-setup/*.log 1>/dev/null 2>&1; then
  mv /var/log/ovirt-hosted-engine-setup/*.log /var/log/ovirt-hosted-engine-setup/engine-logs/
fi


# hosted-engine 배포 명령 실행 및 옵션 지정, 
# 결과를 awk 스크립트로 파이프를 통해 전달
hosted-engine --deploy --4 \
  --ansible-extra-vars=he_offline_deployment=true \
  --config-append=/etc/ovirt-hosted-engine/answers.conf | \
awk '
  BEGIN {
    skip_next_line = 0;    # “Fail” 메시지 다음 줄 스킵 플래그
    prev_skip      = 0;    # 중복 skipping 메시지 제어
    IGNORECASE     = 1;    # 대소문자 구분 없이 매칭/치환
  }
  {
    # 불필요한 정보 줄들 건너뛰기
    if ($0 ~ /STORAGE CONFIGURATION|HOST NETWORK CONFIGURATION|VM CONFIGURATION|HOSTED ENGINE CONFIGURATION|has no domain suffix|using DNS, it can be resolved only locally|Encryption using the Python crypt module is deprecated|The Python crypt module is deprecated and will be removed from Python|Install the passlib library for continued encryption functionality|Deprecation warnings can be disabled|by setting deprecation_warnings=False in ansible.cfg/)
      next;
    if ($0 ~ /^\s*$/)    # 공백 줄 스킵
      next;
    if (skip_next_line == 1) {
      skip_next_line = 0;
      next;
    }
    if ($0 ~ /TASK \[ovirt\.ovirt\.hosted_engine_setup : Fail/) {
      skip_next_line = 1;
      next;
    }

    # “[ INFO ] skipping: [localhost]” 중복 제어
    if ($0 ~ /^\[ INFO\s+\] skipping: \[localhost\]$/) {
      if (prev_skip)
        next;
      else {
        prev_skip = 1;
        gsub(/ovirt/, "rutilvm");  # 치환
        print;
        next;
      }
    } else {
      prev_skip = 0;
    }

    # 최종 출력 직전에 ovirt → rutilvm 치환
    gsub(/ovirt/, "rutilvm");
    print;
  }'

# 최신 로그 파일 하나만 가져오기
shopt -s nullglob
latest_log=$(ls -1t /var/log/ovirt-hosted-engine-setup/ovirt-hosted-engine-setup-[0-9]*.log 2>/dev/null | head -n 1)

# 파일이 존재하고, 실패 문자열이 있으면 종료
if [[ -n "$latest_log" ]]; then
    if grep -q -e "Hosted Engine deployment failed" -e "re-deploy" "$latest_log"; then
        exit 1
    fi
fi

# 설정 변수: 최대 대기 시간 2초, 인터벌 2초, 경과 시간 초기화
TIMEOUT=5
INTERVAL=2
elapsed_time=0

# cloudinit root 계정 암호 설정
cloudinitRootPwd=adminRoot!@#

# engine.zip 파일 암호
cloudinitEnginePwd=itinfo1!

# 엔진 연결 확인 작업 시작 메시지 출력
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Checking connection to engine]"

# 엔진에 연결할 수 있는지 TIMEOUT 시간 내에 반복하여 확인
while [ $elapsed_time -lt $TIMEOUT ]; do
	# 지정된 IP(cloudinitVMStaticCIDR)에 ping 테스트 수행하여 연결 확인
	if ping -c 1 $cloudinitVMStaticCIDR &> /dev/null; then
		echo "[ INFO  ] ok: [localhost]"
		sleep 2
        
		# 파일 시스템 조정 작업 시작 메시지 출력
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : File system adjustment start]"
		
        # ssh 통신 전 root 계정 known_hosts 목록 삭제 (재설치 시 변경된 엔진의 호스트 키 초기화)
        cat /dev/null > /root/.ssh/known_hosts
        
		# 파티션 크기 조정: 파티션 2를 전체 디스크로 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/parted -s /dev/vda resizepart 2 100% >/dev/null 2>&1
		
		# 물리 볼륨 리사이즈 수행
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/pvresize /dev/vda2 >/dev/null 2>&1
		
		# 논리 볼륨 확장 (루트 파티션에 +40G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +40G /dev/ovirt/root >/dev/null 2>&1
		
		# 논리 볼륨 확장 (var 파티션에 +45G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +45G /dev/ovirt/var >/dev/null 2>&1
		
		# 논리 볼륨 확장 (log 파티션에 +30G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +30G /dev/ovirt/log >/dev/null 2>&1
		
		# 파일 시스템 확장: 루트 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs / >/dev/null 2>&1
		
		# /var 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs /var >/dev/null 2>&1
		
		# /var/log 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs /var/log >/dev/null 2>&1

		echo "[ INFO  ] changed: [localhost]"
		
		# 엔진 재조정 관련 작업 준비: 원격지에 디렉터리 생성
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/bin/mkdir -p /var/share/pkg/rutilvm >/dev/null 2>&1
		
		# 엔진 재조정 준비 작업 시작 메시지 출력
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Preparing for engine rebalancing]"
		
		# 로컬에 있는 engine.zip 파일을 원격지의 /var/share/pkg/rutilvm/로 복사
        sshpass -p $cloudinitRootPwd scp -o StrictHostKeyChecking=no /var/share/pkg/repositories/engine.zip root@$cloudinitVMStaticCIDR:/var/share/pkg/rutilvm/ >/dev/null 2>&1
	
		# 원격지에서 암호를 이용해 압축 해제 (압축 해제 시 zipbomb 검출 비활성화)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "export UNZIP_DISABLE_ZIPBOMB_DETECTION=TRUE; /usr/bin/unzip -q -P $cloudinitEnginePwd -o /var/share/pkg/rutilvm/engine.zip -d /var/share/pkg/rutilvm/" >/dev/null 2>&1
	
		# 준비 완료 메시지 출력
		echo "[ INFO  ] ok: [localhost]"
		
        # 스크립트 파일 허가권 부여
		sshpass -p $cloudinitRootPwd ssh -tt -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "chmod 755 /var/share/pkg/rutilvm/engine/*.sh" 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed." || true
			
		# 원격지에서 RutilVM 설치 스크립트 실행
		sshpass -p $cloudinitRootPwd ssh -n -T -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /var/share/pkg/rutilvm/engine/rutilvm-engine-setup.sh 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed." || true
        
        # 원격지에서 RutilVM engine의 NTP 주소 변경
        if [ -z "$ntp_address" ]; then
            ntp_address=$(sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR \
            "grep -E '^\s*server\s+[0-9.]+\s+iburst\b' /etc/chrony.conf | head -n1 | awk '{print \$2}'") || true
        fi
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "ntp_address='$ntp_address'; sed -i \"s|^\s*server\s\+[0-9.]\+\s\+iburst\b|server \$ntp_address iburst|\" /etc/chrony.conf" 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed." || true
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "systemctl restart chronyd" || true
        
		# 원격지에서 /var/share/pkg/rutilvm 내의 *.zip 파일을 제외한 나머지 파일 및 디렉터리를 삭제
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/bin/find /var/share/pkg/rutilvm/ -mindepth 1 ! -name '*.zip' -exec rm -rf {} + || true

        # 현재 호스트의 rutilvm 계정 공개키를 Engine VM의 rutilvm 계정 authorized_keys에 등록
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Registering current host's public key to engine]"
        USERNAME="rutilvm"
        PASSWORD="adminRoot!@#"
        USER_HOME="/home/$USERNAME"
        SSH_DIR="$USER_HOME/.ssh"
        KEY_PATH="$SSH_DIR/id_rsa"
        sshpass -p "$PASSWORD" ssh-copy-id -o StrictHostKeyChecking=no -i $KEY_PATH.pub $USERNAME@"$cloudinitVMStaticCIDR" >/dev/null 2>&1 || true
        echo "[ INFO  ] ok: [localhost]"
        
        # rutilvm 계정이 속한 ovirt 그룹이 /etc/ovirt-engine/aaa/internal.properties 파일을 read/write 할 수 있도록 권한 추가
        echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Granting rutilvm account permissions]"
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@"$cloudinitVMStaticCIDR" chmod 660 /etc/ovirt-engine/aaa/internal.properties || true
        echo "[ INFO  ] ok: [localhost]"

		# 최종 배포 성공 메시지 출력
		echo "RutilVM Hosted Engine successfully deployed"
		# 스크립트를 성공적으로 종료
		exit 0
	fi
	# ping 테스트 실패 시 지정된 인터벌만큼 대기
	sleep $INTERVAL
	# 경과 시간을 인터벌만큼 증가
	elapsed_time=$((elapsed_time + INTERVAL))
done

# TIMEOUT 시간 내에 엔진 연결에 실패하면 오류 메시지 출력 후 실패 종료
echo "Deployment failed. Exiting."
"""
    # =============================================================================
    # --deploy --standard 옵션 처리
    # =============================================================================
    elif "--standard" in args:
        shell_script = r"""
#!/bin/bash

# Last Edit : 20250718-01
# RutilVM 4.5.5 Engine 설정용 스크립트 (CentOS Stream 8 기반)

stty erase ^H                  # 터미널에서 백스페이스 키 설정
export LANG=C                  # 시스템 언어 설정

# ───────────────────────────────────────────────────────────────────
# 호스트명 확인: hostname -i 결과에 127.0.0.1 또는 localhost 가 있으면 즉시 종료
ip_output=$(hostname -i)
if echo "$ip_output" | grep -qE '127\.0\.0\.1|localhost'; then
    echo "You must run host configuration first"
    exit 1
fi
# ───────────────────────────────────────────────────────────────────

# === 사용자 강제 종료 시 즉시 빠져나오기 설정 ===
trap 'stty sane; echo "[ ERROR ] Deployment aborted by user"; exit 1' INT TERM

clear

# 출력할 첫 번째 컬럼의 너비를 91로 설정
col1_width=91
echo ┌────────────────────────────────────────────────────────────────────────────────────────────┐
printf "│ %-${col1_width}s  │\n" "■ RutilVM Engine Configuration"
echo ├────────────────────────────────────────────────────────────────────────────────────────────┤
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "* Pre-requisite Check"
printf "│ %-${col1_width}s│\n" "  - Hardware Requirements:"
printf "│ %-${col1_width}s│\n" "    You need to enable virtualization technology in your server's BIOS, such as "VT-x"."
printf "│ %-${col1_width}s│\n" "    The host system must have at least two network interfaces."
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "  - Storage Requirements:"
printf "│ %-${col1_width}s│\n" "    Prepare shared storage such as FC, iSCSI, or NFS."
printf "│ %-${col1_width}s│\n" "    The shared storage required for engine installation is 200 GB."
printf "│ %-${col1_width}s│\n" "    Shared storage for engine deployment once used cannot be used for reinstallation."
printf "│ %-${col1_width}s│\n" ""
printf "│ %-${col1_width}s│\n" "  - Network Requirements:"
printf "│ %-${col1_width}s│\n" "    Open firewall ports for SSH, Engine, etc."
printf "│ %-${col1_width}s│\n" "    If you use Network Access Control(NAC), register requirements such as IP and MAC"
printf "│ %-${col1_width}s│\n" "     addresses in advance before installing the engine."
printf "│ %-${col1_width}s│\n" ""
echo └────────────────────────────────────────────────────────────────────────────────────────────┘
echo

# ovirt-engine-appliance 패키지가 설치되어 있는지 확인
if ! dnf list installed ovirt-engine-appliance &> /dev/null; then
    rpm_file=$(dnf --quiet repoquery --location ovirt-engine-appliance | sed 's|^file://||' | tail -n 1)
    
    if [[ -n "$rpm_file" && -f "$rpm_file" ]]; then
        echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Install the RutilVM engine package]"
        dnf install -y ovirt-engine-appliance >/dev/null 2>&1

        if dnf list installed ovirt-engine-appliance &> /dev/null; then
            echo "[ INFO  ] RutilVM engine package installation done."
        else
            echo "[WARNING] RutilVM engine package installation failed"
            echo "Aborts installation."
            exit 1
        fi
    else
        echo "[WARNING] The RutilVM engine package is not available in the repository"
        echo "Aborts installation."
        exit 1
    fi
fi

# 스크립트 종료 시 로그 파일을 삭제하도록 trap 등록 (oVirt 자체 로그 화면 출력 미사용 시)
#trap 'rm -f "$LOG_FILE"' EXIT

# engine-logs 디렉터리 생성 및 기존 로그 이동
# 로그 디렉토리 생성 (없을 경우)
[ ! -d /var/log/ovirt-hosted-engine-setup/engine-logs ] && mkdir -p /var/log/ovirt-hosted-engine-setup/engine-logs

# .log 파일이 하나라도 있을 경우에만 이동
if ls /var/log/ovirt-hosted-engine-setup/*.log 1>/dev/null 2>&1; then
  mv /var/log/ovirt-hosted-engine-setup/*.log /var/log/ovirt-hosted-engine-setup/engine-logs/
fi

# 엔진 배포 시작
hosted-engine --deploy --4 --ansible-extra-vars=he_offline_deployment=true

# 최신 로그 파일 하나만 가져오기
shopt -s nullglob
latest_log=$(ls -1t /var/log/ovirt-hosted-engine-setup/ovirt-hosted-engine-setup-[0-9]*.log 2>/dev/null | head -n 1)

# 파일이 존재하고, 실패 문자열이 있으면 종료
if [[ -n "$latest_log" ]]; then
    if grep -q -e "Hosted Engine deployment failed" -e "re-deploy" "$latest_log"; then
        exit 1
    fi
fi

# 설정 변수: 최대 대기 시간 2초, 인터벌 2초, 경과 시간 초기화
TIMEOUT=5
INTERVAL=2
elapsed_time=0

# cloudinit root 계정 암호 설정
cloudinitRootPwd=adminRoot!@#

# engine.zip 파일 암호
cloudinitEnginePwd=itinfo1!

# cloudinitVMStaticCIDR 값 추출
# 검색 대상 디렉토리
answers_dir="/var/lib/ovirt-hosted-engine-setup/answers"
# 1. answers-로 시작하는 파일 목록을 수정 시간 기준으로 정렬
mapfile -t answer_files < <(find "$answers_dir" -type f -name "answers-*" -printf "%T@ %p\n" | sort -nr | awk '{print $2}')
# 2. cloudinitVMStaticCIDR 값 추출 및 정제
declare -A ip_map
for file in "${answer_files[@]}"; do
    while IFS= read -r line; do
        # cloudinitVMStaticCIDR 줄에서 str: 다음에 오는 IP/prefix 값 추출
        if [[ "$line" =~ cloudinitVMStaticCIDR= ]]; then
            value=$(echo "$line" | grep -oP 'str:\K[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')
            if [[ -n "$value" ]]; then
                ip_map["$value"]="$file"
            fi
        fi
    done < "$file"
done
# 중복 제거된 IP 목록 추출
unique_ips=("${!ip_map[@]}")
# 결과를 cloudinitVMStaticCIDR 변수에 저장
cloudinitVMStaticCIDR=""
if [ "${#unique_ips[@]}" -eq 1 ]; then
    cloudinitVMStaticCIDR="${unique_ips[0]}"
elif [ "${#unique_ips[@]}" -gt 1 ]; then
    # 최신 파일 기준으로 필터링
    latest_file="${answer_files[0]}"
    while IFS= read -r line; do
        if [[ "$line" =~ cloudinitVMStaticCIDR= ]]; then
            ip=$(echo "$line" | grep -oP 'str:\K[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')
            if [[ " ${unique_ips[*]} " == *" $ip "* ]]; then
                cloudinitVMStaticCIDR="$ip"
                break
            fi
        fi
    done < "$latest_file"
fi

# 엔진 연결 확인 작업 시작 메시지 출력
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Checking connection to engine]"

# 엔진에 연결할 수 있는지 TIMEOUT 시간 내에 반복하여 확인
while [ $elapsed_time -lt $TIMEOUT ]; do
	# 지정된 IP(cloudinitVMStaticCIDR)에 ping 테스트 수행하여 연결 확인
	if ping -c 1 $cloudinitVMStaticCIDR &> /dev/null; then
		echo "[ INFO  ] ok: [localhost]"
		sleep 2
        
		# 파일 시스템 조정 작업 시작 메시지 출력
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : File system adjustment start]"
		
        # ssh 통신 전 root 계정 known_hosts 목록 삭제 (재설치 시 변경된 엔진의 호스트 키 초기화)
        cat /dev/null > /root/.ssh/known_hosts
        
		# 파티션 크기 조정: 파티션 2를 전체 디스크로 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/parted -s /dev/vda resizepart 2 100% >/dev/null 2>&1
		
		# 물리 볼륨 리사이즈 수행
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/pvresize /dev/vda2 >/dev/null 2>&1
		
		# 논리 볼륨 확장 (루트 파티션에 +40G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +40G /dev/ovirt/root >/dev/null 2>&1
		
		# 논리 볼륨 확장 (var 파티션에 +45G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +45G /dev/ovirt/var >/dev/null 2>&1
		
		# 논리 볼륨 확장 (log 파티션에 +30G 추가)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/lvextend -L +30G /dev/ovirt/log >/dev/null 2>&1
		
		# 파일 시스템 확장: 루트 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs / >/dev/null 2>&1
		
		# /var 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs /var >/dev/null 2>&1
		
		# /var/log 파티션 XFS 파일 시스템 확장
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/sbin/xfs_growfs /var/log >/dev/null 2>&1

		echo "[ INFO  ] changed: [localhost]"
		
		# 엔진 재조정 관련 작업 준비: 원격지에 디렉터리 생성
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/bin/mkdir -p /var/share/pkg/rutilvm >/dev/null 2>&1
		
		# 엔진 재조정 준비 작업 시작 메시지 출력
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Preparing for engine rebalancing]"
		
		# 로컬에 있는 engine.zip 파일을 원격지의 /var/share/pkg/rutilvm/로 복사
        sshpass -p $cloudinitRootPwd scp -o StrictHostKeyChecking=no /var/share/pkg/repositories/engine.zip root@$cloudinitVMStaticCIDR:/var/share/pkg/rutilvm/ >/dev/null 2>&1
	
		# 원격지에서 암호를 이용해 압축 해제 (압축 해제 시 zipbomb 검출 비활성화)
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "export UNZIP_DISABLE_ZIPBOMB_DETECTION=TRUE; /usr/bin/unzip -q -P $cloudinitEnginePwd -o /var/share/pkg/rutilvm/engine.zip -d /var/share/pkg/rutilvm/" >/dev/null 2>&1
	
		# 준비 완료 메시지 출력
		echo "[ INFO  ] ok: [localhost]"
		
        # 스크립트 파일 허가권 부여
		sshpass -p $cloudinitRootPwd ssh -tt -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "chmod 755 /var/share/pkg/rutilvm/engine/*.sh" 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
			
		# 원격지에서 RutilVM 설치 스크립트 실행
		sshpass -p $cloudinitRootPwd ssh -n -T -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /var/share/pkg/rutilvm/engine/rutilvm-engine-setup.sh 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed."
        
        # 원격지에서 RutilVM engine의 NTP 주소 변경
        if [ -z "$ntp_address" ]; then
            ntp_address=$(sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR \
            "grep -E '^\s*server\s+[0-9.]+\s+iburst\b' /etc/chrony.conf | head -n1 | awk '{print \$2}'") || true
        fi
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "ntp_address='$ntp_address'; sed -i \"s|^\s*server\s\+[0-9.]\+\s\+iburst\b|server \$ntp_address iburst|\" /etc/chrony.conf" 2>&1 | grep -v "Connection to $cloudinitVMStaticCIDR closed." || true
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR "systemctl restart chronyd" || true
                
		# 원격지에서 /var/share/pkg/rutilvm 내의 *.zip 파일을 제외한 나머지 파일 및 디렉터리를 삭제
		sshpass -p $cloudinitRootPwd ssh -o StrictHostKeyChecking=no root@$cloudinitVMStaticCIDR /usr/bin/find /var/share/pkg/rutilvm/ -mindepth 1 ! -name '*.zip' -exec rm -rf {} +

        # 현재 호스트의 rutilvm 계정 공개키를 Engine VM의 rutilvm 계정 authorized_keys에 등록
		echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Registering current host's public key to engine]"
        USERNAME="rutilvm"
        PASSWORD="adminRoot!@#"
        USER_HOME="/home/$USERNAME"
        SSH_DIR="$USER_HOME/.ssh"
        KEY_PATH="$SSH_DIR/id_rsa"
        sshpass -p "$PASSWORD" ssh-copy-id -o StrictHostKeyChecking=no -i $KEY_PATH.pub $USERNAME@"$cloudinitVMStaticCIDR" >/dev/null 2>&1
        echo "[ INFO  ] ok: [localhost]"
        
        # rutilvm 계정이 속한 ovirt 그룹이 /etc/ovirt-engine/aaa/internal.properties 파일을 read/write 할 수 있도록 권한 추가
        echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Granting rutilvm account permissions]"
        sshpass -p "$cloudinitRootPwd" ssh -o StrictHostKeyChecking=no root@"$cloudinitVMStaticCIDR" chmod 660 /etc/ovirt-engine/aaa/internal.properties
        echo "[ INFO  ] ok: [localhost]"

		# 최종 배포 성공 메시지 출력
		echo "RutilVM Hosted Engine successfully deployed"
		# 스크립트를 성공적으로 종료
		exit 0
	fi
	# ping 테스트 실패 시 지정된 인터벌만큼 대기
	sleep $INTERVAL
	# 경과 시간을 인터벌만큼 증가
	elapsed_time=$((elapsed_time + INTERVAL))
done

# TIMEOUT 시간 내에 엔진 연결에 실패하면 오류 메시지 출력 후 실패 종료
echo "Deployment failed. Exiting."
"""
    # =============================================================================
    # --deploy --key 옵션 처리
    # =============================================================================
    elif "--key" in args:
        import socket, subprocess, os, re, sys

        # SSH 키 디렉토리 설정
        SSH_DIR = "/home/rutilvm/.ssh"
        port = 22

        # IPv4 형식 검증 함수
        def is_valid_ipv4(ip):
            pattern = r"^((25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.){3}" \
                      r"(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])$"
            return re.match(pattern, ip) is not None

        # 1) 대상 호스트 IP 입력
        while True:
            host_ip = input("Enter the target host IP address: ")
            if not is_valid_ipv4(host_ip):
                print("Invalid IP format. Enter a valid IPv4 address.")
                continue
            break

        # 2) SSH 연결 테스트 및 포트 재입력
        def test_ssh_connection(ip, port, timeout=5):
            try:
                sock = socket.create_connection((ip, port), timeout)
                sock.close()
                return True
            except Exception:
                return False

        while not test_ssh_connection(host_ip, port):
            new_port_str = input(
                f"SSH port {port} not reachable. Enter correct SSH port for {host_ip}: "
            )
            if new_port_str.isdigit():
                port = int(new_port_str)
            else:
                print("Invalid port number. Enter a numeric value.")

        # 3) 비밀번호 재시도 로직: 최대 3회
        attempts = 0
        while attempts < 3:
            password = get_password_masked(
                f"Enter password for rutilvm@{host_ip}:{port}: "
            )
            cmd = [
                "sshpass", "-p", password,
                "ssh-copy-id", "-f",
                "-p", str(port),
                "-o", "StrictHostKeyChecking=no",
                "-i", os.path.join(SSH_DIR, "id_rsa.pub"),
                f"rutilvm@{host_ip}"
            ]
            result = subprocess.run(
                cmd, stdout=subprocess.PIPE,
                stderr=subprocess.PIPE, universal_newlines=True
            )
            if result.returncode == 0:
                print(f"Public key registration successful: rutilvm@{host_ip}:{port}")
                sys.exit(0)
            else:
                print("Permission denied, Try again.")
                attempts += 1

        # 4) 3회 시도 실패 시 중단
        print("Failed to register public key. Aborting.")
        sys.exit(1)

    else:
        print_help()
        sys.exit(0)

    with tempfile.NamedTemporaryFile(delete=False, mode="w", suffix=".sh") as tmp:
        tmp.write(shell_script)
        script_path = tmp.name
    os.chmod(script_path, stat.S_IRWXU)
    result = subprocess.run(["bash", script_path])
    os.remove(script_path)
    sys.exit(result.returncode)

# 6) 단일 CLI 명령 처리
if opt in SINGLE_CMD:
    subprocess.run(SINGLE_CMD[opt])
    sys.exit(0)

# 7) 인증 및 연결 초기화
fqdn = get_fqdn_from_config()
ip   = get_ip_from_hosts(fqdn)
url  = f"https://{ip}:8443/ovirt-engine/api"
print(f"RutilVM {fqdn}({ip})")

session_data = load_session()
if session_data and session_data.get("url") == url:
    username = session_data["username"]
    password = session_data["password"]
else:
    username = input("Username: ")
    if "@" not in username:
        username += "@internal"
    for attempt in range(3):
        if attempt > 0:
            print("Password does not match. Try again.")
        password = get_password_masked("Password: ")
        try:
            with Connection(url=url, username=username, password=password, insecure=True, timeout=10) as conn_temp:
                conn_temp.system_service().get()
            save_session(username, password, url)
            break
        except Exception:
            if attempt == 2:
                print("Permission denied (publickey,gssapi-keyex,gssapi-with-mic,password).")
                sys.exit(1)

connection = Connection(url=url, username=username, password=password, insecure=True)
cleanup_old_sessions()

# 8) curses UI 호출 또는 메인 메뉴
if opt in ui_map:
    curses.wrapper(ui_map[opt], connection)
else:
    curses.wrapper(main_menu, connection)

sys.exit(0)
