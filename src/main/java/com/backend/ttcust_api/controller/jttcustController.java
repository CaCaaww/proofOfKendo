package com.backend.ttcust_api.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.ttcust_api.model.ttcust;
import com.backend.ttcust_api.persistance.jttcustDAO;

import java.util.logging.Logger;
import java.util.logging.Level;

@RestController
@RequestMapping("/jttcust")
public class jttcustController {
    private static final Logger LOG = Logger.getLogger(ttcustController.class.getName());
    private jttcustDAO jttcustDAO;
    
    public jttcustController() throws IOException{
        jttcustDAO = new jttcustDAO();
    }
    @GetMapping("/{custID}")
    public ResponseEntity<ttcust> getTtcust(@PathVariable String custID){
        LOG.info("GET /jttcust/" + custID);
        try {
            ttcust result = jttcustDAO.geTtcustsByID(custID);
            if (result != null){
                return new ResponseEntity<ttcust>(result, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("")
    public ResponseEntity<ttcust[]> getTtcust(){
        LOG.info("GET /jttcust");
        try{
            return new ResponseEntity<ttcust[]>(jttcustDAO.getAllTtcusts(),HttpStatus.OK);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/")
    public ResponseEntity<ttcust[]> searchTtcust(@RequestParam String name){
        LOG.info("GET /jttcust/?name=" + name);
        try {
            ttcust[] result = jttcustDAO.getTtcustsByName(name);
            if (result != null){
                return new ResponseEntity<ttcust[]>(result, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 

    @PostMapping("")
    public ResponseEntity<ttcust> createTtcust(@RequestBody ttcust cust){
        LOG.info("POST /jttcust" + cust);
        try {
            return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("")
    public ResponseEntity<ttcust> updateTtcust(@RequestBody ttcust cust){
        LOG.info("PUT /jttcust" + cust);
        try {
            return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ttcust> deleteTtcust(@PathVariable String id){
        LOG.info("DELETE /jttcust/" + id);
        try {
            return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
