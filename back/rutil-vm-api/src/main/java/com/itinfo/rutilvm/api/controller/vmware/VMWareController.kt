package com.itinfo.rutilvm.api.controller.vmware

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.error.IdNotFoundException
import com.itinfo.rutilvm.api.error.InvalidRequestException
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.service.ItVMWareVmService

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["VMWare", "VM"])
@RequestMapping("/api/v1/vmware/vms")
class VMWareController: BaseController() {
	@Autowired private lateinit var vmwareVm: ItVMWareVmService


}
