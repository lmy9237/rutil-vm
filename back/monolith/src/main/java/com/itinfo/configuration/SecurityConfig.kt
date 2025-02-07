package com.itinfo.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.security.CustomAccessDeniedHandler
import com.itinfo.security.CustomAuthFailureHandler
import com.itinfo.security.CustomAuthProvider
import com.itinfo.security.SecurityConnectionService

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity

import org.springframework.security.web.SecurityFilterChain

import kotlin.jvm.Throws

@Configuration
@EnableWebSecurity
//@EnableGlobalMethodSecurity(securedEnabled = true)
class SecurityConfig {

	@Bean
	@Throws(Exception::class)
	fun filterChain(http: HttpSecurity): SecurityFilterChain? {
		log.debug("... filterChan")
		http
			.csrf().disable()
			.authorizeRequests()
			.antMatchers(
				"/websocket/**",
				"/vmConsole/**",
				"/login",
				"/login/**",
				"/resources/**",
				"/css/**",
				"/fonts/**",
				"/images/**",
				"/js/**",
				"/vendors/**",
				"/**"
			).permitAll()
			.antMatchers(
				"/v2/api-docs/**",
				"/swagger.json",
				"/swagger-ui/**",
				"/swagger-ui.html/**",
				"/configuration/**",
				"/swagger-resources/**",
				"/webjars/**",
				"/webjars/springfox-swagger-ui/*.{js,css}"
			).permitAll()
			.antMatchers("/**").permitAll()
			.anyRequest().authenticated()
			.and()
			.formLogin()
				.loginPage("/login")
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/loginSuccess", true)
				.usernameParameter("userid")
				.passwordParameter("passwd")
				.successForwardUrl("/loginSuccess")
				// .successHandler(customAuthenticationProvider())
				.failureUrl("/login")
				.failureHandler(customAuthFailureHandler())
				.permitAll()
			.and()
			.logout()
				.invalidateHttpSession(true)
				.logoutUrl("/logout")
				.deleteCookies("JSESSIONID")
				.logoutSuccessUrl("/login")
			.and()
			.authenticationProvider(customAuthenticationProvider())
			// .httpBasic(Customizer.withDefaults())
			.httpBasic()
			// .exceptionHandling()
			//	.accessDeniedHandler(customAccessDeniedHandler())?.and()
			// JWT를 사용하게 될 경우 활성화
//			.sessionManagement()
//			 	.sessionCreationPolicy(SessionCreationPolicy.STATELESS)

        return http.build()
	}

    @Bean
    fun customAuthenticationProvider(): CustomAuthProvider {
        log.info("... customAuthenticationProvider")
        return CustomAuthProvider()
    }

	@Bean
	fun customAccessDeniedHandler(): CustomAccessDeniedHandler {
		log.info("... customAccessDeniedHandler")
		return CustomAccessDeniedHandler()
	}

	@Bean
	fun customAuthFailureHandler(): CustomAuthFailureHandler {
		log.info("... customAuthFailureHandler")
		return CustomAuthFailureHandler()
	}

	@Bean
	fun securityConnectionService(): SecurityConnectionService {
		log.info("securityConnectionService ... ")
		return SecurityConnectionService()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}