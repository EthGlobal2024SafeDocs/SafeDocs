# SafeDocs

Safedocs is a way for users to share timed access to their files privately and securely.
This is especially useful for:
- sharing official id to government authorities
- sharing timed content to users
- loaning ebooks 


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

![MultiShare](/readme_img/readme_multishare.png)

## Trustless Time-Based Access Control

To solve for these issues, we've created a trustless time-based access control system.
- Files are encrypted on device and sent to our servers for storage
- Sharers create a time-based access control passes to share their files with others
- Consumers present their passes to access the content

![Store and Share](/readme_img/readme_store_share.png)
![Distribution](/readme_img/readme_distribution.png)