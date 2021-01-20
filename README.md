# Serverless Wetter API

[![Build Status](https://travis-ci.com/evagrean/sls-wetter-api.svg?branch=development)](https://travis-ci.com/evagrean/sls-wetter-api)
[![Build Status](https://travis-ci.com/evagrean/sls-wetter-api.svg?branch=master)](https://travis-ci.com/evagrean/sls-wetter-api)

## Allgemeine Informationen

Öffentliche, Serverless API, die auf Anfrage über die aktuelle Temperatur in einer deutschen Stadt informiert. Die API wurde umgesetzt als Lambda Function mit NodeJS.

## Anforderungen

### Allgemeine Funktionsweise

API muss einen Endpunkt zur Verfügung stellen, der auf einen HTTPS GET Request und einen deutschen Städtenamen als Parameter reagiert. Zurück kommen soll eine Response im JSON Format, die das Wetter in der angefragten Stadt als String in einem einzigen Satz zusammenfasst.
. | .
------------ | -------------
**Endpoint:** | /wetter
**Query Parameter:** | ?stadt=[EINE_DEUTSCHE_STADT_DER_WAHL]
**Request Beispiel:** | [https]://vjqa72tir7.execute-api.eu-central-1.amazonaws.com/dev/wetter?stadt=berlin
**HTTP Method:** | GET
**Response body data Format:** | JSON Objekt, das Wetter als String in einem einzigen Satz zusammenfasst.
**Response Beispiel:** | {"summary": "In Berlin hat es heute 31.15 °C"}

### Weitere Kriterien

- das Projekt sollte als Serverless Function mit NodeJS umgesetzt werden
- das Projekt sollte bei einem Cloud Computing Service deployt werden
- das Projekt sollte ein selbst gewähltes Maß an Tests beinhalten
- das Projekt sollte eine einfache CI integriert haben, die automatisch Tests ausführt, wenn Pull Requests erstellt werden
- CI so einrichten, dass alles, was in `master` gemergt wird, automatisch deployt wird

## Arbeitschritte

### 1. Serverless Function

Als ersten Schritt habe ich mich um die logic des API gekümmert. Ich habe bereits eine API mit NodeJS und **AWS Lambda** gebaut und besitze einen AWS Account. Deshalb habe ich mich wieder für diesen Provider entschieden.

Um den Service aufzusetzen, habe ich das **Serverless Framework** benutzt. `Serverless` hatte ich schon global installiert.
Begonnen habe ich dann mit einem Template:

```
sls create --template aws-nodejs
```

Danach habe ich die `serverless.yml` Datei angepasst (z.B. `region` definiert, eine `getTemp` Funktion definiert und den `wetter` Endpoint).

Um Anfragen an das API von openweathermap.org zu stellen, habe ich `axios` installiert, sowie das `serverless-offline-plugin`, um den Endpoint lokal testen zu können.

Danach habe ich den Code bei AWS deployt

```
sls deploy
```

und den Endpoint live getestet (mehr dazu siehe Abschnitt **Tests**).

Zurückgreifen konnte ich bei beim Erstellen vor allem auf meine Erfahrungen aus einem vorherigen `Serverless Projekt`. Eine gute Quelle waren auch die Docs des [Serverless Framework](https://www.serverless.com/framework/docs/). Einige "Gehirnknoten" konnte [dieser Post](http://toniando.com/posts/weather-in-venice-web-app-lambda-and-api-gateway/) lösen.

Nachdem ich eine funktionierende API hatte, deren Endpoint erfolgreich Wetterdaten zur Verfügung stellt, habe ich mich um die Integrierung einer CI gekümmert.

### 2. CI

Hier habe ich mich für **TravisCI** entschieden. Ich konnte die CI so einrichten, dass (auf `prod` Stage) deployt wird, was ich in `master` merge. Auch führt die CI automatisch Tests aus, wenn Pull Requests erstellt werden.

![Pull-Request GitHub](/assets/pullrequest.png) ![Travis Builds](/assets/builds.png)

Da ich mit einer `development` und `master` Branch arbeite, wollte ich, dass die CI beide auch auf verschiedenen Stages hochlädt. In diesem Fall bin ich [diesem Blogbeitrag](https://seed.run/blog/how-to-build-a-cicd-pipeline-for-serverless-apps-with-travis-ci.html) gefolgt und habe dafür zwei separate AWS User Accounts erstellt. Die AWS Credentials habe ich dann bei TravisCI in den `Environment Variables` hinterlegt.

![AWS User](/assets/aws-user.png) ![Travis Env Var](/assets/travis-env.png)

Hier habe ich viel mit der Dokumentation von TravisCI gearbeitet. Auch [dieses Tutorial](https://medium.com/swlh/setup-ci-cd-pipeline-for-aws-lambda-using-github-travis-ci-9812c8ef7199) hat mir sehr geholfen.

### 3. Tests

#### Lokale Tests

- `serverless invoke local`
- `serverless-offline` plugin, um den API Endpoint zu testen

#### Endpoint Tests

- Postman

![Postman](/assets/postman.png)

- AWS: API Gateway Method Execution Test

![AWS method test](/assets/aws-method-ex.png)

- TravisCI Builds

## Links

**Endpoint auf 'dev' Stage:**

[https://vjqa72tir7.execute-api.eu-central-1.amazonaws.com/dev/wetter](https://vjqa72tir7.execute-api.eu-central-1.amazonaws.com/dev/wetter)

**Endpoint auf 'prod' Stage:**

[https://vq0pl8jzv5.execute-api.eu-central-1.amazonaws.com/prod/wetter](https://vq0pl8jzv5.execute-api.eu-central-1.amazonaws.com/prod/wetter)
