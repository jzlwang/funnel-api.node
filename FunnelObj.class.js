"use strict" ;

class FunnelObj {
    constructor(fDB) {
        this.fDB = fDB ;
        this.fDB.MySQLConnect() ;
    }

    // pass through to FunnelDB implementation
    
    dbConnectState(response) {
        console.log("dbstatus returning: " + this.fDB.dbConnectState) ;
        response.end(JSON.stringify(this.fDB.dbConnectState)) ;
    }
    doStatus(response) { this.fDB.doStatus(response) }
    doPing(response) { this.fDB.doPing(response) }

    // Get All Tags
    
    _handleGetAllTags(response, error, results, fields) {
        if (undefined === error || null !== error ) {
            let response_string = "Error querying for all customers: " + error ;
            console.log(response_string) ;
            response.end(response_string) ;
        } else {
            let response_string = JSON.stringify(results) ;
            console.log("getAllTags got results: " + response_string) ;
            response.end(response_string) ;
        }
    }
    
    getAllTags(response) {
        this.fDB.getAllTags(response, this._handleGetAllTags.bind(this)) ;
    }

    // Get All Customers
    
    _handleGetAllCustomers(response, error, results, fields) {
        if (undefined === error || null !== error ) {
            let response_string = "Error querying for all customers: " + error ;
            console.log(response_string) ;
            response.end(response_string) ;
        } else {
            let response_string = JSON.stringify(results) ;
            console.log("getAllCustomers got results: " + response_string) ;
            response.end(response_string) ;
        }
    }
    
    getAllCustomers(response) {
        this.fDB.getAllCustomers(response, this._handleGetAllCustomers.bind(this)) ;
    }

    // Get One Customer
    
    _handleGetCustomer(response, name, error, results, fields) {
        if (undefined === error || null !== error) {
            let response_string = "Error querying for a single customer: " + error ;
            console.log("_getCustomer_cb: " + response_string) ;
            response.end(JSON.stringify(response_string)) ;
        } else {
            let response_string = JSON.stringify(results) ;
            console.log("getCustomer got results: " + results)
            response.end(response_string) ;
        }
    }
            
    getCustomer(response, name) {
        this.fDB.getCustomer(response, name, this._handleGetCustomer.bind(this)) ;
    }
    
    // new customer flow:
    // get customer -> if null, create customer

    _addC_handleAddCustomer(response, name, error, results, fields) {
        if (undefined === error || null !== error) {
            let response_string = "Error adding, " + name + ": " + error ;
            console.log("_addC_handleAddCustomer: " + response_string) ;
            response.end(JSON.stringify( [ Boolean(false), result_string ] )) ;
        } else {
            let response_string = JSON.stringify(results) ;
            console.log("_addC_handleAddCustomer got results: " + response_string) ;
            response.end(JSON.stringify(Boolean(true))) ;
        }
    }

    _addC_addCustomer(response, name, error, results, fields) {
        this.fDB.addCustomer(response, name,
                             this._addC_handleAddCustomer.bind(this)) ;
    }

    _addC_getCustomer(response, name, error, results, fields) {
        if (undefined === error || null !== error) {
            let response_string = "Error querying for customer: " + error ;
            console.log("__addC_getCustomer: " + response_string) ;
            response.end(JSON.stringify( [ Boolean(false), response_string ] )) ;
        } else {
            let response_string = "Invalid request, customer already exists. " ;
            console.log("_addC_getCustomer: "
                        + response_string + JSON.stringify(results)) ;
            response.end(JSON.stringify( [ Boolean(false), response_string ] )) ;
        }
    }
    
    addCustomer(response, name) {
        this.fDB.getCustomer(response, name, this._addC_getCustomer.bind(this)) ;
    }

    // new evidence flow
    // 
    // let's just do something simple for now, no edge-checking of inputs
    // don't interpret customer or label; just blindly insert the values

    _handleNewEvidence(response, customerID, error, results, fields) {
        if (undefined === error || null !== error) {
            let response_string = "Error adding new evidence: " + error ;
            console.log("_handleNewEvidence: " + response_string) ;
            response.end(JSON.stringify( [ Boolean(false), response_string ] )) ;
        } else {
            console.log("_handleNewEvidence: " + JSON.stringify(results)) ;
            response.end(JSON.stringify(Boolean(true))) ;
        }
    }
    
    newEvidenceByCustomerID(response, customerID, tag, snippet, href) {
        this.fDB.newEvidence(response, customerID, tag, snippet, href,
                             this._handleNewEvidence.bind(this)) ;
    }
}

module.exports = FunnelObj ;

