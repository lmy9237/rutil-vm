package com.itinfo.service

import com.itinfo.model.UserVo

/**
 * [UsersService]
 * 사용자 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 * @see com.itinfo.service.impl.UsersServiceImpl
 */

interface UsersService {
	/**
	 * [UsersService.fetchUsers]
	 * 사용자 목록 조회
	 *
	 * @return [List] 사용자 목록
	 */
	fun fetchUsers(): List<UserVo>

	/**
	 * [UsersService.fetchUser]
	 * 사용자 상세 조회
	 *
	 * @param id [String] 사용자 id
	 * @return [UserVo] 사용자 정보
	 */
	fun fetchUser(id: String): UserVo?

	/**
	 * [UsersService.isExistUser]
	 * 사용자 존재 여부
	 *
	 * @param user [UserVo] 사용자 정보
	 * @return [Boolean] 존재 여부
	 */
	fun isExistUser(user: UserVo): Boolean

	/**
	 * [UsersService.removeUsers]
	 * 여러 사용자 제거
	 *
	 * @param users [List] (제거 할) 사용자 목록
	 * @return [Int] 제거 여부
	 */
	fun removeUsers(users: List<UserVo>): Int
	fun addUser(user: UserVo): Int
	fun updateUser(user: UserVo): Int
	fun updatePassword(user: UserVo): Int
	fun updateLoginCount(user: UserVo): Int
	fun login(id: String): String
}

