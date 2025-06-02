package com.backend.ttcust_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.backend.ttcust_api.controller.ttcustController;

@SpringBootApplication(scanBasePackageClasses = ttcustController.class)
public class TtcustApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TtcustApiApplication.class, args);
	}

}
