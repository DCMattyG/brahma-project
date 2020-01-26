# brahma

Cisco ACI deployment...SIMPLIFIED!


## Business/Technical Challenge


One of the most challenging hurdles for customers to adopting ACI as a technology, is the initial setup/configuration of ACI...implementing networking with a GUI when the customer has used CLI based configurations for many times decades.  

This project is being developed to provide a more seamless transition to ACI for customers by simplifying the initial setup, taking the vast majority of the most common implementation requirements of customers and making all of that complexity disappear.  

You want ACI for your software-define networking? You don't care about every little setting and just want it up and running quickly, without clicking between dozens of different tabs and windows? Brahma is for YOU!  


## Proposed Solution


Brahma provide an EXTREMELY easy to use CLI and SaaS interface that takes the unfamiliar feeling of ACI away, and replaces it with a sense of satisfaction knowing that you have the best SDN in the world up and running is mere minutes!  

Just create a token with CLI, login to the SaaS dashboard, configure, and apply!  


### Cisco Products Technologies/ Services

Our solution will levegerage the following Cisco technologies

* [Application Centric Infrastructure (ACI)](http://cisco.com/go/aci)
* [ACI Cobra SDK](https://github.com/datacenter/cobra)

## Team Members


**TODO:** ASIC projects must consist of a minimum of 2 SE’s
representing a minimum of 2 segments. List names here

* Matthew Garrett <matgarre@cisco.com> - USC (West)
* Tim Miller <timmil@cisco.com> - GVE (US)
* Tyson Scott <tyscott@cisco.com> - GES (MWA)
* Mike Finch <micfinch@cisco.com> - GES (South)


## Solution Components


Brahma is comprised of two major componest; a CLI front-end, and a SaaS back-end.  

The brahma-cli component is written in Python. Python was chosen because Brahma leverages the ACI Cobra SDK to read and apply configuration to ACI environments. Python made it extremely simply to integrate the components together. The brahma-cli also uses ArgParse, so it can be used much like many of your favorite CLI's from other vendors (AWS as an example).

The SaaS back-end is written in Angular (Javascript) and served out via NodeJS. Brahma also uses the Cisco-UI kit to skin the dashboard so that it looks and feels like many other Cisco UI'a. Angular made rapid development a snap as the Angular CLI can quickly build out skeleton framework in a single command, as well as expand with additional components & services in a similar fashion. NodeJS enables a simple API interface for both the brahma-cli as well as the internal web services to communicate.

All of these components can be nicely containerized allowing extreme ease in distributing and maintaining the Brahma code/program. Docker-Compose adds yet another level where Docker networks and persistent volumes can also be spun up simultaneously so all of the many Brahma components can go from zero to fully running in about a minute.

All data is stored in a MongoDB database that is also running in Docker via Docker-Compose. Since Brahma is dealing with JSON formats and API calls, a document DB such as MongoDB was the ideal choice. Not to mention the phenomenal support & integration with NodeJS.


## Usage

1) Run 'brahma-cli -n' (create a new Brahma token)
2) Navigate to http://brahma.cisco.com and paste in your token
3) Throw your config settings into the wizard and save
4) Run 'brahma-cli -a' to apply the settings to ACI
5) Done!


## Prerequisites

- Docker 18.x (or higher)
- Docker-Compose 1.25.x (or higher)
- Node 8.x (or higher)
- Angular CLI 7.x (or higher)
- Python 3.x
- ACI Cobra SDK (https://&lt;apic&gt;/cobra/_downloads/)

## Installation

For Server:  
git clone https://github.com/DCMattyG/brahma-project.git  
cd brahma-project  
./brahma-server.sh -compose -up  
  
For CLI:  
pip install brahma-cli  

Environment Variables for Testing:  
export BRAHMA_URL=&lt;url&gt; (e.g. localhost)  
export BRAHMA_PORT=&lt;port&gt; (e.g. 3000)  


## Documentation

Brahma Documentation/Wiki is current in developent. Stay tuned!  


## License

Provided under Cisco Sample Code License, for details see [LICENSE](./LICENSE.md)

## Code of Conduct

Our code of conduct is available [here](./CODE_OF_CONDUCT.md)

## Contributing

See our contributing guidelines [here](./CONTRIBUTING.md)
