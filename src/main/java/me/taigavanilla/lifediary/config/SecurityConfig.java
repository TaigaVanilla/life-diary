package me.taigavanilla.lifediary.config;

import me.taigavanilla.lifediary.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Autowired private CustomUserDetailsService userDetailsService;

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(
            authz ->
                authz
                    .requestMatchers("/", "/favicon.ico", "/css/**", "/js/**")
                    .permitAll()
                    .requestMatchers("/api/auth/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .userDetailsService(userDetailsService)
        .formLogin(
            formLogin ->
                formLogin
                    .loginPage("/")
                    .loginProcessingUrl("/api/auth/login")
                    .successHandler(
                        (request, response, authentication) -> {
                          response.setStatus(200);
                        })
                    .failureHandler(
                        (request, response, exception) -> {
                          response.setStatus(401);
                        })
                    .permitAll())
        .logout(
            logout ->
                logout
                    .logoutUrl("/api/auth/logout")
                    .logoutSuccessHandler(
                        (request, response, authentication) -> {
                          response.setStatus(200);
                        }));

    return http.build();
  }
}
