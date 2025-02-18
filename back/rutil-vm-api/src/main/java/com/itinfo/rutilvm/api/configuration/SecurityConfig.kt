package com.itinfo.rutilvm.api.configuration

import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(

) {
	@Bean
	@Throws(Exception::class)
	fun filterChain(http: HttpSecurity): SecurityFilterChain? {
		log.debug("... filterChan")
		http.cors(Customizer.withDefaults())
			.csrf().disable()
			// .httpBasic().disable()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			.and()
			.exceptionHandling()
			// .accessDeniedHandler(jwtAccessDeniedHandler)
			.and()
			.authorizeRequests()
			.antMatchers("/**").permitAll()
			.anyRequest().authenticated()
/*
			.formLogin()
				.loginPage("/login")
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/loginSuccess", true)
				.usernameParameter("userid")
				.passwordParameter("passwd")
				.successForwardUrl("/loginSuccess")
				// .successHandler(customAuthenticationProvider())
				.failureUrl("/login")
//				.failureHandler(customAuthFailureHandler())
				.permitAll()
			.and()
*/
        return http.build()
	}

	@Bean
	fun corsFilter(): CorsFilter {
		log.debug("... corsFilter")
		val config = CorsConfiguration()
		config.addAllowedOrigin("https://localhost:3000")
		// Or, if you want to allow all origins (use with caution):
		// config.addAllowedOriginPattern("*");
		config.addAllowedHeader("*")
		config.addAllowedMethod("*")
		config.allowCredentials = true


		val source: UrlBasedCorsConfigurationSource = UrlBasedCorsConfigurationSource().apply {
			registerCorsConfiguration("/**", config)
		}
		return CorsFilter(source)
	}
/*
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
*/
	companion object {
		private val log by LoggerDelegate()
	}
}
