package com.MyProject.MavHelp.Security;

import com.MyProject.MavHelp.Service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = null;

        // Step 1: Check Authorization header
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("[DEBUG_LOG] Authorization header: " + header);
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            System.out.println("[DEBUG_LOG] Extracted token from header: " + token);
        }

        // Step 2: If no header token, check cookies
        if (token == null && request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    System.out.println("[DEBUG_LOG] Extracted token from cookie: " + token);
                    break;
                }
            }
        }

        // Step 3: Validate and authenticate
        if (token != null && jwtTokenProvider.validateToken(token)) {
            String email = jwtTokenProvider.getEmailFromToken(token);
            System.out.println("[DEBUG_LOG] Email from token: " + email);

            var userDetails = userDetailsService.loadUserByUsername(email);
            System.out.println("[DEBUG_LOG] UserDetails username: " + userDetails.getUsername());

            var authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            System.out.println("[DEBUG_LOG] Authentication set in SecurityContextHolder");
        } else if (token == null) {
            System.out.println("[DEBUG_LOG] No token found in header or cookie");
        } else {
            System.out.println("[DEBUG_LOG] Token found but invalid");
        }

        filterChain.doFilter(request, response);
    }

}
