# Serverless Wetter API


## Inhaltsübersicht
* Allgemeine Informationen
* Funktionen Anforderungen
* API Endpoint
* Verwendete Technologien und Resourcen
* Setup
* Schritte bei der Umsetzung
* Herausforderungen und Problemstellungen

## Allgemeine Informationen

Öffentliche, Serverless API, die auf Anfrage über die aktuelle Temperatur in einer deutschen Stadt informiert.  Die API wurde umgesetzt als Lambda Function mit NodeJS und auf Amazon AWS bereitgestellt. 

## Funktionen und Features

* Stellt einen Endpunkt zur Verfügung, der auf einen HTTPS GET Request mit einem deutschen Städtenamen als Parameter eine Response im JSON Format liefert 
* Response fasst das Wetter als String in einem einzigen Satz zusammenfasst.
* API umgesetzt als Serverless Function mit NodeJS, deployt bei Amazon AWS
* Integrierte CI (TravisCI)
  * führt automatisch Tests aus, wenn Pull-Requests erstellt werden
  * development branch deployt auf dev stage, master branch deployt auf prod stage
  * Environment Variables: jeweils ein AWS user-account für deploys zu dev und prod stage 
  * bei merge im master bzw. development wird automatisch deployt

  
  
## Kriterien, die noch nicht erfüllt sind

* Unit und Integration Tests für Lambda Function selbst
* Verwendung von TypeScript statt JavaScript

## Endpoint

### Liefert eine Zusammenfasssung von Städtenamen und Temperatur in einem Satz

**Endpoint:** /wetter

**Query Parameter:** ?stadt=[EINE_DEUTSCHE_STADT_DER_WAHL]

**HTTP Method:** GET

**Request body Datenformat:** ---

**Response body data Format:** JSON Objekt, das Wetter als String in einem einzigen Satz zusammenfasst. 

**Response Beispiel:** 
```
{
  "summary": "In Berlin sind es heute 31.15 Grad Celsius"
}
```

## Technologien, Dependencies und Resourcen

* Node 12.17.0
* axios 0.19.2
* Serverless Framework  1.78.1 (besser als AWS SAM wegen der plugins)
* serverless-offline 6.5.0
* TravisCI
* Cloud Provider: Amazon AWS
* API von openweathermap.org

## Wie ich das Setup gemacht habe

### Lambda Function / wetter-api service erstellen

```
$ npm serverless install -g
$ mkdir sls-wetter-api
$ cd sls-wetter-api
$ serverless create --template aws-nodejs --path wetter-api
$ npm init -y
$ npm install axios
$ npm install serverless-offline -D
```
* serverless.yml konfigurieren

### GitHub Repository

### TravisCI

* .travis.yml file
* GitHub App für sls-wetter-api Repository aktiviert
* Environment Variables für dev und prod stages setzen
* Job Template (deploy_service_job) in .travis.yml kreiert und Environment Variables eingesetzt
* in serverless.yml custom.stage definiert

### Voraussetzungen
* AWS account bzw. 2 separate accounts für dev und prod
* GitHub account
* TravisCI account
* Node (to use npm)

## Allgemeine Herangehensweise und Arbeitsschritte 

* Erstes Ziel: funktionierendes API / service 
  * Basic Lambda Function mit serverless kreiert und geschaut, dass get request und Anfrage an Wetter-API funktionieren
* Dann: Für TravisCI entschieden, Docs gelesen, Tutorials durchgegangen und setup gemacht
* Zunächs hat dann wetter-api service nicht mehr funktioniert (lag an fehlenden node_modules bzw. package.json)
* Probleme mit Pull-Requests bzw. zunächst an anderem Repository überhaupt Pull Requests ausprobiert und geübt
* hatte zunächst .travis.yml so konfiguriert, dass Pull Requests in eigene stage deployt werden bzw. sofort deployt wurden und nicht erst nach merge
* Lösung dafür: kein deploy_service_job für pull requests, sondern merge (push) löst job erst für dev oder master branch aus

## Probleme und ihre Lösungen

* wetter-api service hat zunächst nach Integrierung der CI nicht funktioniert
--> das lag daran, dass npm install im build Prozess nicht durchgeführt werden konnte, da kein package.json vorhanden war
--> Lösung: axios deinstalliert, npm init -y, axios wieder installiert, nochmal deployt

## Tests

### Endpoint

* lokal mittels `serverless-offline plugin`
* Postman 
* Method Execution Test via Amazon API Gateway

### Lambda Function
* `serverless-offline plugin`
* `serverless local invoke`
* TravisCI Builds

### Unit und Integration Tests?
* Serverless Architektur ist abhängig von Cloud Services, die man lokal schwer nachahmen kann
* business logic sollte so geschrieben sein, dass sie vom Provider unabhängig ist. Das macht sie nicht von einem bestimmten Provider abhänging, wiederverwendbar und auch leichter testbar
* z.B. mit Unit und Integration Tests
* Und hier liegt das Problem: in meinem Fall ist die business logic an Lambdas event Object gebunden (wg. der queryStringParameter)
--> wie schreibe ich das um? 

### Verwendung von TypeScript statt JavaScript
* serverless-bundle?
* https://www.youtube.com/watch?v=tQWAy2YZERU
* sls create -t aws-nodejs-typescript creates a template to use typescript
