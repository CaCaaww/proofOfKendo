package com.backend.ttcust_api.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.backend.ttcust_api.persistance.ttcustDAO;

import java.util.logging.Logger;
import java.util.logging.Level;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/ttcust")
public class ttcustController {
    private static final Logger LOG = Logger.getLogger(ttcustController.class.getName());
    private ttcustDAO ttcustsDAO;
    
    public ttcustController() throws IOException{
        ttcustsDAO = new ttcustDAO();
    }
    @GetMapping("/{custID}")
    public ResponseEntity<ttcust> getTtcust(@PathVariable String custID){
        LOG.info("GET /ttcust/" + custID);
        try {
            ttcust cust = ttcustsDAO.getTtcustById(custID);
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
        LOG.info("GET /ttcust");
        try{
            ttcust[] custs = ttcustsDAO.getAllTtcusts();
            return new ResponseEntity<ttcust[]>(custs, HttpStatus.OK);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/")
    public ResponseEntity<ttcust[]> searchTtcust(@RequestParam String name){
        LOG.info("GET /ttcust/?name=" + name);
        try {
            ttcust[] custs = ttcustsDAO.findTtcustsByName(name);
            return new ResponseEntity<ttcust[]>(custs, HttpStatus.OK);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 

    @PostMapping("")
    public ResponseEntity<ttcust> createTtcust(@RequestBody ttcust cust){
        LOG.info("POST /ttcust" + cust);
        try {
            ttcust testCust = ttcustsDAO.getTtcustById(cust.getTtcustID());
            if (testCust != null){
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            ttcust newCust = ttcustsDAO.createTtcust(cust);
            return new ResponseEntity<ttcust>(newCust, HttpStatus.OK);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("")
    public ResponseEntity<ttcust> updateTtcust(@RequestBody ttcust cust){
        LOG.info("PUT /ttcust" + cust);
        try {
            ttcust updatedCust = ttcustsDAO.updateTtcust(cust);
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
        LOG.info("DELETE /ttcust/" + id);
        try {
            boolean worked = ttcustsDAO.deleteTtcust(id);
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
