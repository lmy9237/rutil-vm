package com.itinfo.rutilvm.api.service.auth

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.repository.aaarepository.entity.OvirtUser
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.setting.PermissionVo
import com.itinfo.rutilvm.api.model.setting.toPermissionVo
import com.itinfo.rutilvm.api.model.setting.toPermissionVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.ItCloudException

import org.ovirt.engine.sdk4.builders.PermissionBuilder
import org.ovirt.engine.sdk4.builders.RoleBuilder
import org.ovirt.engine.sdk4.builders.UserBuilder
import org.ovirt.engine.sdk4.types.Permission
import org.ovirt.engine.sdk4.types.Role
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


interface ItPermissionService {
	/**
	 * [ItPermissionService.findAllFromUser]
	 * 사용자의 권한 목록조회
	 *
	 * @param username [String]
	 * @return List<[PermissionVo]>
	 */
	@Throws(ItCloudException::class)
	fun findAllFromUser(username: String): List<PermissionVo>
	/**
	 * [ItPermissionService.findOneFromUser]
	 * 사용자의 권한 상세조회
	 *
	 * @param username [String]
	 * @param permissionId [String]
	 * @return [PermissionVo]
	 */
	@Throws(ItCloudException::class)
	fun findOneFromUser(username: String, permissionId: String): PermissionVo?
	/**
	 * [ItPermissionService.addFromUser]
	 * 사용자의 권한 등록
	 *
	 */
	@Throws(ItCloudException::class)
	fun addFromUser(username: String, permissionName: String = "SuperUser"): PermissionVo?
}

@Service
class PermissionServiceImpl(

): BaseService(), ItPermissionService {
	@Autowired private lateinit var ovirtUser: ItOvirtUserService

	override fun findAllFromUser(username: String): List<PermissionVo> {
		log.info("findAllFromUser ... username: {}", username)
		val user: OvirtUser = ovirtUser.findOneAAA(username)
		val res: List<Permission> =
			conn.findAllAssignedPermissionsFromUser(user.uuid.toString())
				.getOrDefault(listOf())
		return res.toPermissionVos(conn)
	}

	override fun findOneFromUser(username: String, permissionId: String): PermissionVo? {
		log.info("findAllFromUser ... username: {}, permissionId: {}",username, permissionId)
		val user: OvirtUser = ovirtUser.findOneAAA(username)
		val res: Permission =
			conn.findAssignedPermissionFromUser(user.uuid.toString(), permissionId)
				.getOrNull() ?: throw ErrorPattern.ROLE_NOT_FOUND.toException()
		return res.toPermissionVo(conn)
	}

	override fun addFromUser(username: String, permissionName: String): PermissionVo? {
		log.info("add ... username: {}", username)
		val userFound: OvirtUser = ovirtUser.findOneAAA(username)
		log.debug("userFound.id ... {}", userFound.uuid)

		val roleFound: Role =
			conn.findAllRoles()
				.getOrDefault(listOf())
				.firstOrNull { it.namePresent() && it.name().contains(permissionName) } ?: throw ErrorPattern.ROLE_NOT_FOUND.toException()
		log.debug("roleFound.id ... {}", roleFound)

		val permission2Add: Permission = PermissionBuilder()
			.user(UserBuilder().id(userFound.uuid).build())
			.role(RoleBuilder().id(roleFound.id()))
			.build()
		val res: Permission? =
			conn.addSystemPermission(permission2Add)
				.getOrNull()
		return res?.toPermissionVo(conn)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}