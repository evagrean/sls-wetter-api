# Serverless Wetter API
[![Build Status](https://travis-ci.com/evagrean/sls-wetter-api.svg?branch=development)](https://travis-ci.com/evagrean/sls-wetter-api)
[![Build Status](https://travis-ci.com/evagrean/sls-wetter-api.svg?branch=master)](https://travis-ci.com/evagrean/sls-wetter-api)

## Allgemeine Informationen

Öffentliche, Serverless API, die auf Anfrage über die aktuelle Temperatur in einer deutschen Stadt informiert.  Die API wurde umgesetzt als Lambda Function mit NodeJS.

## Anforderungen

### Allgemeine Funktionsweise
API muss einen Endpunkt zur Verfügung stellen, der auf einen HTTPS GET Request und einem deutschen Städtenamen als Parameter reagiert. Zurück kommen soll eine Response im JSON Format, die das Wetter in der angefragten Stadt als String in einem einzigen Satz zusammenfasst. 

key | value
------------ | -------------
**Endpoint:** | /wetter
**Query Parameter:** | ?stadt=[EINE_DEUTSCHE_STADT_DER_WAHL]
**Request Beispiel:** | https://vjqa72tir7.execute-api.eu-central-1.amazonaws.com/dev/wetter?stadt=berlin
**HTTP Method:** | GET
**Response body data Format:** | JSON Objekt, das Wetter als String in einem einzigen Satz zusammenfasst. 
**Response Beispiel:** | {"summary": "In Berlin hat es heute 31.15 °C"}

### Weitere Kriterien

* Das Projekt soll als Serverless Function mit NodeJS umgesetzt werden
* Das Projekt soll bei einem Cloud Computing Service deployt werden
* Das Projekt sollte ein selbst gewähltes Maß an Tests beinhalten
* Das Projekt sollte eine einfache CI integriert haben, die automatisch Tests ausführt, wenn Pull Requests erstellt werden

### Bonus-Kriterien

* CI so einrichten, dass alles, was in `master` gemergt wird, automatisch deployt wird
* TypeScript statt JavaScript verwenden

## Arbeitschritte, um Kriterien zu erfüllen

### 1. Serverless Function

Als ersten Schritt habe ich mich um die logic des API gekümmert. Da ich schon zuvor einmal ein API mit NodeJS und `AWS Lambda`s gebaut habe und deshalb bereits einen AWS Account besitze, habe ich mich wieder für diesen Provider entschieden.

Um den Service aufzusetzen, habe ich das `Serverless Framework` benutzt (u.a wg. nötiger Dependencies + serverless-offline plugin zum Testen). `Serverless` hatte ich schon global installiert.
Begonnen habe ich dann mit einem Template:
```
sls create --template aws-nodejs
```
Danach habe ich die `serverless.yml` Datei angepasst (z.B. `region` definiert, eine `getTemp` Funktion definiert und den `wetter` Endpoint). 

Um Anfragen an das API von openweathermap.org zu stellen, habe ich `axios` installiert, sowie das `serverless-offline-plugin`, um dann den Endpoint testen zu können. 

Danach habe ich den Code bei AWS deployt
```
sls deploy
```
um zu prüfen, ob alles funktioniet (Näheres dazu im Abschnitt Tests).

Zurückgreifen konnte ich bei beim Erstellen vor allem auf meine Erfahrungen aus einem vorherigen `Serverless Projekt`, an dem ich im Rahmen meines CareerFoundry Kurses gearbeitet habe. Gute Quellen auch die Docs des [Serverless Framework](https://www.serverless.com/framework/docs/). Einige "Gehirnknoten" konnte aber auch [dieser Post](http://toniando.com/posts/weather-in-venice-web-app-lambda-and-api-gateway/) lösen. 

Erst, nachdem ich ein funktionierendes MVP hatte, das erfolgreich Wetterdaten zur Verfügung stellt, habe ich mich um die Integrierung einer CI gekümmert. Der Grund: In dieses Konzept musste ich mich erst einarbeiten, da ich damit noch nicht gearbeitet habe.

### 2. CI

Hier habe ich mich für TravisCI entschieden (Open Source und sitzen in Berlin :-)). Und um es vorweg zu nehmen: Tatsächlich habe ich es auch geschafft, es so einzurichten, dass (auf `prod` Stage) deployt wird, was ich in `master` merge. Auch führt die CI automatisch Tests aus, wenn Pull Requests erstellt werden. 

![Pull-Request GitHub](/assets/pullrequest.png)    ![Travis Builds](/assets/builds.png)

Da ich bei `GitHub` mit einer `development` und `master` Branch arbeite, wollte ich, dass die CI beide auch auf verschiedenen Stages hochlädt. In diesem Fall habe ich mich auch dazu entschieden, dafür 2 separate AWS User Accounts zu erstellen. Die AWS Credentials habe ich dann bei TravisCI in den `Environment Variables` hinterlegt.

![AWS User](/assets/aws-user.png) ![Travis Env Var](/assets/travis-env.png)

Da die Arbeit mit einem CI absolutes Neuland für mich war, habe ich viel mit der Dokumentation von TravisCI gearbeitet. Aber auch  [dieser Blogbeitrag](https://seed.run/blog/how-to-build-a-cicd-pipeline-for-serverless-apps-with-travis-ci.html) sowie auch [dieses Tutorial](https://medium.com/swlh/setup-ci-cd-pipeline-for-aws-lambda-using-github-travis-ci-9812c8ef7199) haben mir sehr geholfen, wenn ich nicht weiterkam.

### 3. Tests

#### Lokale Tests

* `serverless invoke local`
* `serverless-offline` plugin, um den API Endpoint zu testen

#### Endpoint Tests

* Postman

![Postman](/assets/postman.png)
* AWS: API Gateway Method Execution Test

![AWS method test](/assets/aws-method-ex.png)

* TravisCI Builds



#### Unit und Integration Tests

Mein selbst gewähltes Maß an Tests entspricht in diesem Fall den oben genannten. Ich habe es leider nicht geschafft, meine Lambda Funktion so (um-) zu schreiben, dass die Einheiten, die ich testen möchte, nicht mehr an das `event` Objekt gebunden sind. Auch ist mir trotz langer Recherche noch nicht ganz klar, wie ich entsprechende mock-events für Funktionen erstellen kann, um diese lokal zu testen.

Experimentiert habe ich mit `Jest` und simplen Lambda Funktionen ohne `events`. Um Unit und Integration Tests erfogreich für meine Wetter-API durchführen zu können, muss ich mich noch besser in dieses Thema einarbeiten. Dafür hat mir aber im Rahmen dieses Projektes die Zeit gefehlt.

#### 4. TypeScript

TypeScript habe ich bereits in einem `Angular` Projekt verwendet, aber noch nie in Zusammenhang mit AWS Lambda oder Serverless Funktionen. 

In diesem Fall habe ich zum Üben ein eigenes Mini-Projekt daraus gemacht, und meine `getTemp` Lambda Funktion unabhängig von diesem Projekt [hier noch einmal in TypeScript](https://github.com/evagrean/ts-sls-wetter-api) geschrieben.

## Links

**Endpoint auf 'dev' Stage:**

[https://vjqa72tir7.execute-api.eu-central-1.amazonaws.com/dev/wetter](https://vjqa72tir7.execute-api.eu-central-1.amazonaws.com/dev/wetter)

**Endpoint auf 'prod' Stage:** 

[https://vq0pl8jzv5.execute-api.eu-central-1.amazonaws.com/prod/wetter?stadt=berlin](https://vq0pl8jzv5.execute-api.eu-central-1.amazonaws.com/prod/wetter?stadt=berlin)

## Danke

Ich bedanke mich für diese Herausforderung. Falls noch Fragen offen geblieben sind, beantworte ich sie jederzeit gerne.



