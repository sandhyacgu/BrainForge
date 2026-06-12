package com.cognitivefitness.service;

import com.cognitivefitness.dto.request.LoginRequest;
import com.cognitivefitness.dto.request.RegisterRequest;
import com.cognitivefitness.dto.response.AuthResponse;
import com.cognitivefitness.entity.User;
import com.cognitivefitness.exception.ApiException;
import com.cognitivefitness.repository.UserRepository;
import com.cognitivefitness.security.jwt.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

     @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("sandy");
        registerRequest.setEmail("sandy@test.com");
        registerRequest.setPassword("Password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("sandy@test.com");
        loginRequest.setPassword("Password123");

        user = User.builder()
                .id("user-id-1")
                .username("sandy")
                .email("sandy@test.com")
                .passwordHash("hashedPassword")
                .role(User.Role.USER)
                .emailVerified(false)
                .build();
    }

    @Test
    void register_shouldCreateUser_whenEmailAndUsernameAreUnique() {
        // Arrange
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("hashedPassword");
        when(jwtProvider.generateToken(registerRequest.getEmail())).thenReturn("mocked-jwt-token");

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response.getToken()).isEqualTo("mocked-jwt-token");
        assertThat(response.getUsername()).isEqualTo("sandy");
        assertThat(response.getEmail()).isEqualTo("sandy@test.com");
        assertThat(response.getRole()).isEqualTo("USER");
        assertThat(response.getMessage()).isEqualTo("Registration successful");

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_shouldThrowConflict_whenEmailAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Email already in use");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_shouldThrowConflict_whenUsernameAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Username already taken");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_shouldReturnToken_whenCredentialsAreValid() {
        // Arrange
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtProvider.generateToken(user.getEmail())).thenReturn("mocked-jwt-token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response.getToken()).isEqualTo("mocked-jwt-token");
        assertThat(response.getUsername()).isEqualTo("sandy");
        assertThat(response.getEmail()).isEqualTo("sandy@test.com");
        assertThat(response.getMessage()).isEqualTo("Login successful");

        verify(authenticationManager, times(1)).authenticate(any());
    }

    @Test
    void login_shouldThrowNotFound_whenUserDoesNotExistAfterAuthentication() {
        // Arrange
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("User not found");
    }
}