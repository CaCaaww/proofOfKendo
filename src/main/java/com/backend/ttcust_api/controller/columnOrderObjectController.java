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

import com.backend.ttcust_api.model.dataColumn;
import com.backend.ttcust_api.model.columnOrderObject;
import com.backend.ttcust_api.persistance.columnOrderObjectDAO;


import java.util.logging.Logger;
import java.util.logging.Level;
@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/coloo")
public class columnOrderObjectController {
    private static final Logger LOG = Logger.getLogger(ttcustController.class.getName());
    private columnOrderObjectDAO columnOrderObjectDAO;
    
    public columnOrderObjectController() throws IOException{
        columnOrderObjectDAO = new columnOrderObjectDAO();
    }
    @GetMapping("/{identity}")
    public ResponseEntity<dataColumn[]> getColoo(@PathVariable String identity){
        LOG.info("GET /coloo/" + identity);
        try {
            dataColumn[] result = columnOrderObjectDAO.getColumnOrderByUserAndColumnId(identity);
            if (result != null){
                return new ResponseEntity<dataColumn[]>(result, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("")
    public ResponseEntity<columnOrderObject[]> getColoo(){
        LOG.info("GET /coloo");
        try{
            columnOrderObject[] result = columnOrderObjectDAO.getAllColumnOrderObjects();
            return new ResponseEntity<columnOrderObject[]>(result, HttpStatus.OK);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/u")
    public ResponseEntity<columnOrderObject[]> searchColooByUserId(@RequestParam String userId){
        LOG.info("GET /coloo/u?userId=" + userId);
        try {
            columnOrderObject[] result = columnOrderObjectDAO.getColumnOrderByUserId(userId);
            return new ResponseEntity<columnOrderObject[]>(result, HttpStatus.OK);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/c")
    public ResponseEntity<columnOrderObject[]> searchColooByColumnId(@RequestParam String columnId){
        LOG.info("GET /coloo/c?columnId=" + columnId);
        try {
            columnOrderObject[] result = columnOrderObjectDAO.getColumnOrderByColumnId(columnId);
            return new ResponseEntity<columnOrderObject[]>(result, HttpStatus.OK);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 

    @PostMapping("")
    public ResponseEntity<columnOrderObject> createColoo(@RequestBody columnOrderObject coloo){
        LOG.info("POST /coloo" + coloo);
        try {
            dataColumn[] testColoo = columnOrderObjectDAO.getColumnOrderByUserAndColumnId(coloo.getUserId()+coloo.getColumnId()); //changed |
            if (testColoo != null){
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            columnOrderObject newColoo = columnOrderObjectDAO.createColumnOrderObject(coloo);
            return new ResponseEntity<columnOrderObject>(newColoo, HttpStatus.OK);
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("")
    public ResponseEntity<columnOrderObject> updateColoo(@RequestBody columnOrderObject coloo){
        LOG.info("PUT /coloo" + coloo);
        try {
            columnOrderObject updatedColoo = columnOrderObjectDAO.updateColumnOrderObject(coloo);
            if (updatedColoo != null){
                return new ResponseEntity<columnOrderObject>(updatedColoo, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e){
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{identity}")
    public ResponseEntity<columnOrderObject> deleteTtcust(@PathVariable String identity){
        LOG.info("DELETE /coloo/" + identity);
        try {
            return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/byCol/{columnId}")
    public ResponseEntity<columnOrderObject[]> deleteColooByColId(@PathVariable String columnId){
        LOG.info("Delete /coloo/byCol/" + columnId);
        try {
            columnOrderObject[] result = columnOrderObjectDAO.deleteByColumnId(columnId);
            return new ResponseEntity<columnOrderObject[]>(result, HttpStatus.OK);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

