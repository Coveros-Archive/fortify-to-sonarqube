# Fortify to SonarQube

Node.js app as Docker image to convert Fortify SCA CSV output to SonarQube Generic Issue JSON. 

### Distributable Docker Image

Available as the Docker image `coveros/fortify-to-sonarqube`: https://hub.docker.com/r/coveros/fortify-to-sonarqube

```
$ docker pull coveros/fortify-to-sonarqube
```

### Transform Fortify CSV to SonarQube JSON

Mount the host directory containing the input file and the output file destination. By default, the application
expects the input file to be `/app/date/input.csv`, and will output to `/app/data/output.json`. 

To use these default settings, place the input file at `/host/path/to/files/input.csv` on your machine, and run the
following command:

```
$ docker run --rm -v /host/path/to/files:/app/data coveros/fortify-to-sonarqube
```

The JSON output will be availabe at `/host/path/to/files/output.json`

To specify the names of the input and output files, execute the `transform` command, defining one or
both as input arguments. For example, if you have an input file `/host/path/to/files/custom-input-name.csv` and you would
like to generate `/host/path/to/files/custom-output-name.json`, run the following command:

```
$ docker run --rm -v /host/path/to/files:/app/data coveros/fortify-to-sonarqube transform -i /app/data/custom-input-name.csv -o /app/data/custom-output-name.json
```

### Use in Jenkins Pipeline

Before converting the Fortify CSV input into the output required for the SonarQube Generic Webhook, you first need to
perform the Fortify SCA scan and convert the output to csv using `FPRUtility`.

```
docker.image(<IMAGE WITH FORTIFY SCA>).inside() {
  ...perform Fortify scan, generating .fpr file...
  sh "FPRUtility -information -listIssues -project path/to/fpr/output.fpr -outputFormat CSV -f path/to/fprcsv.csv"
}
```

By using `docker.image().inside()`, Jenkins will mount the workspace directory to the `fortify-to-sonarqube` container, 
and execute the commands from that location. Therefore, the file locations will be relative to the workspace. Set the
input file to the csv created in the prior step.

```
docker.image('coveros/fortify-to-sonarqube:latest').inside() {
  sh 'transform -i path/to/fprcsv.csv -o path/to/output.json'
}
```

Upload the transformed output as a SonarQube External Issues Report: https://docs.sonarqube.org/latest/analysis/external-issues/

For example, when using Maven

```
mvn sonar:sonar -Dsonar.externalIssuesReportPaths=path/to/output.json
```

### Example Transformation

##### Fortify CSV 
```
sep=,
IID, category, path, analyzer
1, Dead Code: Unused Field, src/main/java/com/api/helloWorld/HelloWorld.java:41, structural
```

##### SonarQube Generic Issue JSON

```
{
  "issues": [
    {
      "engineId": "fortify",
      "ruleId": "1",
      "primaryLocation": {
        "message": "Dead Code: Unused Field",
        "filePath": "src/main/java/com/api/helloWorld/HelloWorld.java",
        "textRange": {
          "startLine": 41
        }
      },
      "type": "VULNERABILITY",
      "severity": "INFO",
      "effortMinutes": 0
    }
  ]
}
```


### From Source

#### Build

To compile the Typescript source into distributable Javascript

```
$ npm run tsc
```

Compiled Javascript located in the `dist` directory 

#### Test

Application uses Jest for unit testing

```
$ npm run test
```

#### Lint

Application uses TSLint for code quality analysis

```
$ npm run lint 
```

#### Run

Run the application, specifying the input file and output file location

```
$ npm run start -- -i /path/to/input.csv -o /path/to/output.json
```

or...

```
$ node dist/index.js -i /path/to/input.csv -o /path/to/output.json
```

For example

```
$ npm run start -- -i ./test/testinput.csv -o ./test/testoutput.json
```

#### Build Docker Image

To build the docker image `coveros/fortify-to-sonarqube:latest`

```
$ docker build -t coveros/fortify-to-sonarqube:latest .
```
