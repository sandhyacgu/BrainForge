package com.cognitivefitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(
    scanBasePackages = "com.cognitivefitness",
    exclude = { UserDetailsServiceAutoConfiguration.class }
)
public class CognitiveFitnessApplication {

    public static void main(String[] args) {
        SpringApplication.run(CognitiveFitnessApplication.class, args);
    }
}