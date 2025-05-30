package com.backend.controller;

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

import com.backend.model.ttcust;
import com.backend.persistance.ttcustDAO;

import java.util.logging.Logger;
import java.util.logging.Level;

@RestController
@RequestMapping("/ttcust")
public class ttcustController {
    private static final Logger LOG = Logger.getLogger(ttcustController.class.getName());
    private ttcustDAO custDAO;
    
    public ttcustController(ttcustDAO custDAO){
        this.custDAO = custDAO;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ttcust> getTtcust(@PathVariable String custID){
        LOG.info("GET /heroes/" + custID);
        try {
            ttcust cust = custDAO.getTtcust(custID);
            if (cust != null){
                return new ResponseEntity<ttcust>(cust, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("")
    public ResponseEntity<ttcust[]> getTtcust(){
        LOG.info("GET /heroes");
        try{
            ttcust[] custs = custDAO.getTtcusts();
            return new ResponseEntity<ttcust[]>(custs, HttpStatus.OK);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    public ResponseEntity<ttcust[]> searchTtcust(@RequestParam String name){
        LOG.info("GET /heroes/?name=" + name);
        try {
            ttcust[] custs = custDAO.findTtcusts(name);
            return new ResponseEntity<ttcust[]>(custs, HttpStatus.OK);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 

    @PostMapping("")
    public ResponseEntity<ttcust> createTtcust(@RequestBody ttcust cust){
        LOG.info("POST /heroes" + cust);
        try {
            ttcust newCust = custDAO.createTtcust(cust);
            return new ResponseEntity<ttcust>(newCust, HttpStatus.OK);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("")
    public ResponseEntity<ttcust> updateTtcust(@RequestBody ttcust cust){
        LOG.info("PUT /heroes" + cust);
        try {
            ttcust updatedCust = custDAO.updateTtcust(cust);
            if (updatedCust != null){
                return new ResponseEntity<ttcust>(updatedCust, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ttcust> deleteTtcust(@PathVariable String id){
        LOG.info("DELETE /heroes/" + id);
        try {
            boolean worked = custDAO.deleteTtcust(id);
            if (worked){
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
