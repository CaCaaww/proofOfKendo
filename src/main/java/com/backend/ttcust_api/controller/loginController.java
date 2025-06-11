package com.backend.ttcust_api.controller;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.ttcust_api.model.dataColumn;
import com.backend.ttcust_api.persistance.jttcustDAO;
import com.backend.ttcust_api.persistance.loginDAO;

//NOT USED TO BE TERMINATED
@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/login")
public class loginController {
    private static final Logger LOG = Logger.getLogger(ttcustController.class.getName());
    private loginDAO loginDAO;

    public loginController(){
        loginDAO = new loginDAO();
    }

    @GetMapping("/{username}")
    public ResponseEntity<String> loginAttempt(@PathVariable String username){
        LOG.info("GET /login/" + username);
        try {
            String result = loginDAO.loginRequest(username);
            if (result != null){
                return new ResponseEntity<String>(result, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
