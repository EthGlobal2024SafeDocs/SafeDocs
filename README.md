# SignScan: Secure, Decentralized Content Delivery System

## Overview

Hello! This is **SignScan**.
It is a content delivery system that uses decentralized technologies to offer secure, private, and exclusive access to digital content.

We use Sign Protocol, Basin S3, and a cryptographic technique of proxy re-encryption to ensure that content is delivered securely, without compromising user control or privacy.

Safedocs is a way for users to share timed access to their files privately and securely.
This is especially useful for:
- sharing official id to government authorities
- sharing timed content to users
- loaning ebooks 

### SignScan in Action

| The Multishare Problem | Store and Share | Distribution |
| --- | --- | --- |
| ![Multishare](/readme_img/readme_multishare.png) | ![Store and Share](/readme_img/readme_store_share.png) | ![Distribution](/readme_img/readme_distribution.png) |

## Table of Contents
1. [Features](#features)
2. [The Problem](#the-problem)
3. [Trustless Time-Based Access Control](#trustless-time-based-access-control)
    - [Store and Share](#store-and-share)
    - [Distribution](#distribution)
4. [System Architecture](#system-architecture)
    - [Attestation-Based Access Control](#attestation-based-access-control)
    - [Content Storage and Security with Basin S3](#content-storage-and-security-with-basin-s3)
    - [Proxy Re-Encryption for Secure Content Delivery](#proxy-re-encryption-for-secure-content-delivery)
    - [Client-Side Encryption and Decryption](#client-side-encryption-and-decryption)
5. [Component Breakdown of SignScan](#component-breakdown-of-signScan)

## Features

- **Decentralized Access Control:** 
    - Uses Sign Protocol attestations as passes to securely access exclusive content.
- **Encrypted Content Storage:** 
    - Store encrypted files securely using Basin S3, ensuring no unauthorized consumption.
- **Zero-Knowledge Server Operations:** 
    - Our servers never handle unencrypted data or know the contents of your documents.
- **Proxy Re-Encryption:** 
    - Securely re-encrypt content for delivery, ensuring it can only be decrypted by the intended recipient.
- **Client-Side Security:** 
    - All encryption and decryption operations are performed on the user's device, guaranteeing privacy.

## The Problem

Typical access control requires a lot of overhead to set up.
This involves:
- granting access
- encryption
- delivery

Managing temporary access to your files while sharing with multiple people presents a big challenge when you try to scale.
- Redundant files are created even if they're never accessed
- Manual process to encrypt and share files
- Replay attacks are possible for simple access control systems 

## Trustless Time-Based Access Control

To solve for these issues, we've created a trustless time-based access control system.
- Files are encrypted on device and sent to our servers for storage
- Sharers create a time-based access control passes to share their files with others
- Consumers present their passes to access the content

## System Architecture

### Attestation-Based Access Control

**SignScan** uses Sign Protocol's attestations as passes to control access to content. Here’s how it works:

- **Pass Issuance:** Content owners issue unique attestations to consumers, granting them access to specific content for a predetermined time.
- **Pass Verification:** Consumers present their attestation to SignScan's servers. The server verifies the pass by checking ownership and expiry details, ensuring that only authorized users can access the content.

### Content Storage and Security with Basin S3

- **Encrypted Storage:** All files are encrypted by the content creator and stored securely using Basin S3. Content Identifiers (CIDs) are stored in a secure directory on SignScan’s servers, preventing unauthorized access.
- **Secure Directory Management:** CIDs are protected on the server side, adding an extra layer of security and ensuring that content can only be retrieved with a valid attestation. The CIDs are not stored on the attestation itself since attestations are public. Doing so would expose the content to unauthorized access.

### Proxy Re-Encryption for Secure Content Delivery

- **No Plain Text Handling:** Content is uploaded to SignScan fully encrypted by the creator, ensuring that our servers never see plain text files.
- **Transformation Key Integration:** A transformation key, tailored to the consumer’s public key, is included in the attestation, allowing the server to re-encrypt content specifically for the consumer.
- **Re-Encryption Process:** Upon receiving a valid attestation, the server re-encrypts the content and delivers it to the consumer, who can decrypt it using their private key.

### Client-Side Encryption and Decryption

- **Custom Wallet Creation:** Content creators and consumers create custom wallets via the SignScan client app. These wallets securely store private keys used for encryption and decryption.
- **On-Device Security:** All encryption and decryption processes occur on the user's device, ensuring no sensitive data is transmitted over the network.


## Component Breakdown of SignScan

### 1. Client Side Attestation Manager
   - **Description:** Manages the creation, issuance, and verification of attestations that serve as passes for content access.
   - **Responsibilities:**
     - Generate unique transformation keys for the consumer to decrypt the content.
     - Decides on the validity period for each data access pass.     
   - **Interfaces:**
     - Accesses server's API endpoints for creating and issuing attestations.
     - Interface for verification of attestations when consumers request content access.
   - **Technologies Used:**
     - Generates a secp256k1 key pair for new wallet creation.
     - Uses private key to encrypt content for secure storage via server API.
     - Proxy Re-encryption to generate transformation key
     - Digital signatures to sign in
   
**2. Server Side Content Store and Retriever**
   - **Description:** Handles the secure storage of encrypted content and manages retrieval operations when a valid attestation is presented.
   - **Responsibilities:**
     - Store encrypted files in Basin S3.
     - Maintain a secure directory of Content Identifiers (CIDs).
     - Associate CIDs with user facing document ids.
   - **Interfaces:**
     - Uploading encrypted content.
     - Retrieving content based on document id.     
   - **Technologies Used:**
     - Basin S3 for decentralized storage.
     - MongoDB for internal database.
   
**3. Proxy Re-Encryption Service**
   - **Description:** Provides re-encryption services to transform encrypted content for specific consumers, enabling secure delivery.
   - **Responsibilities:**
     - Fetch encrypted content from S3 and the transformation key from the attestation.
     - Re-encrypt the content so that only the intended consumer can decrypt it.
     - Ensure that the original content is never exposed in plain text during the process.
   - **Technologies Used:**
     - Proxy re-encryption library.     

**4. Server Side Content Delivery and Access Control**
   - **Description:** Manages the secure delivery of content to consumers based on valid attestations.
   - **Responsibilities:**
     - Act as a gatekeeper by verifying attestation validity before content delivery.
     - Ensure content is delivered in its re-encrypted form, tailored to the consumer.
   - **Interfaces:**
     - API for consumers to request content access.
     - Integration with the proxy re-encryption service to securely re-encrypt and deliver content.
   - **Technologies Used:**
     - Node and Express for API endpoints.




## A Typical SafeDocs Share Scenario

Alice wants to share her official ID with Bob for a week.

- On her device, Alice encrypts her ID and uploads it to SafeDocs
- SafeDocs generates a document id for the file and stores it in the database
- Alice uploads her ID to SafeDocs
- Alice creates a pass for Bob to access her ID
- Whenever Bob wants to fetch the document, Bob presents the pass to access the ID to the server.

SafeDocs runs both on the web and on mobile devices.
These client 
