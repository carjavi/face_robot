//Control Siro
// @author Carlos Briceño 06-2019

//commands
//aut --> activa la busqueda de personas
//fon -->front
//bac -->back
//rig -->rigth
//lef -->left
//sto -->stop
//red -->RGB
//blu -->RGB
//gre -->RGB

//Observacion: al probar desde el IDE de arduino se suma el salto de linea al comando xxx@ por ello para sacar el comando el intervalo es 1-4 ej: (str.substring(1, 4)
// la idea que cuando detecta personas laterales se mueva hasta tenerlas en frente y alli entre en funcionamiento de detector de rostro.

String sonar_data;
char data[10];
int dataIndex = 0;
String valor;
String Dato = "";
boolean autonomo = false;
int m = 0;
int p = 0;
int k = 0;
// buscar personas
int presence = 0;
int s = 0;
int b = 0; // es un contador que se incrementa cuando no encuentra a nadie cerca

//Definicion de Pines
int IN1=2; 
int IN2=3; 
int IN3=4; 
int IN4=5; 

int red=10;
int blue=11; 
int green=9; 

long duration, distance, RightSensor,FrontSensor,LeftSensor;
int red_value;


//sonar
#define trigPin1 14 
#define echoPin1 15
#define trigPin2 16
#define echoPin2 17
#define trigPin3 18
#define echoPin3 19


void setup() {
  //motor control
  pinMode(IN1, OUTPUT); 
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); 
  pinMode(IN4, OUTPUT);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  //sonar
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);
  pinMode(trigPin3, OUTPUT);
  pinMode(echoPin3, INPUT);
  //led RGB
  pinMode(red, OUTPUT);
  pinMode(blue, OUTPUT);
  pinMode(green, OUTPUT);
  //RGB
  analogWrite(red, 0);
  analogWrite(blue, 255);
  analogWrite(green, 0);
  
  Serial.begin(9600);
  
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB
  }
  //Serial.println("Siro control Ready...");
  //Serial.println();

}

void loop() {

  //Sonar
  SonarSensor(trigPin1, echoPin1);
  LeftSensor = distance;
  SonarSensor(trigPin2, echoPin2);
  FrontSensor = distance;
  SonarSensor(trigPin3, echoPin3);
  RightSensor = distance;
  sonar_data = String(LeftSensor) + "<" + String(FrontSensor) + ">" + String(RightSensor)+ "%" + presence + "&" + b;
  Serial.println(sonar_data);

  if (autonomo == true){
       if (RightSensor < 60 && LeftSensor < 60){ // si tiene a 2 personas a los lados el robot va hacia atras. Solo una vez!!!!!... debe activarse otra funcion para que se cumpla esta esta otra vez
                       if (k == 0){
                          // atras
                          digitalWrite(IN1, HIGH);
                          digitalWrite(IN2, LOW);
                          digitalWrite(IN3, HIGH);
                          digitalWrite(IN4, LOW);
                          delay(1000);
                          digitalWrite(IN1, LOW);
                          digitalWrite(IN2, LOW);
                          digitalWrite(IN3, LOW);
                          digitalWrite(IN4, LOW);
                          k++;
                          p=0;
                          m=0;
                          b = 0;
                     }
      }
      if(RightSensor < 60 || LeftSensor < 60){ // si tiene a "1" personas a los lados el robot gira. Solo una vez!!!!!... debe activarse otra funcion para que se cumpla esta otra vez
            if (RightSensor > LeftSensor){
                       if (m == 0){
                          digitalWrite(IN1, HIGH);
                          digitalWrite(IN2, LOW);
                          digitalWrite(IN3, LOW);
                          digitalWrite(IN4, HIGH);
                          delay(1000);
                          digitalWrite(IN1, LOW);
                          digitalWrite(IN2, LOW);
                          digitalWrite(IN3, LOW);
                          digitalWrite(IN4, LOW);
                          //m++; // para que se active una sola vez
                          p=0;
                          b = 0;
                     }
            }
            if (RightSensor < LeftSensor){
                        if (p == 0){
                          digitalWrite(IN1, LOW);
                          digitalWrite(IN2, HIGH);
                          digitalWrite(IN3, HIGH);
                          digitalWrite(IN4, LOW);
                          delay(1000);
                          digitalWrite(IN1, LOW);
                          digitalWrite(IN2, LOW);
                          digitalWrite(IN3, LOW);
                          digitalWrite(IN4, LOW);
                         // p++; // para que se active una sola vez
                          m = 0;
                          b = 0;
                     }           
            }
        
      }//*******************************************************************************************************************************************************************************
      
      
      
      // se acerca al frente
      if (FrontSensor<60 && FrontSensor>40){
               b = 0;
              digitalWrite(IN1, LOW);
              digitalWrite(IN2, HIGH);
              digitalWrite(IN3, LOW);
              digitalWrite(IN4, HIGH);
              delay(1000);
              
      }
      if (FrontSensor<40){ // ya tiene alguien cerca. Nota: no se detiene nada a menos que el cerebro diga que debe parar el modo automatico
        presence = 1; //despues que encontro a alguien en el frente el status pasa de 0 a 1;
      }
      


   // si no encuentra a nadie cada 30seg se mueve
   if (b>130){
    presence = 2;
    analogWrite(red, 255);
    analogWrite(blue, 255);
    analogWrite(green, 255);
    // envia presencia = 2 que es que esta aburrido el robot
    sonar_data = String(LeftSensor) + "<" + String(FrontSensor) + ">" + String(RightSensor)+ "%" + presence + "&" + b;
    Serial.println(sonar_data);
    //------------------------------------------------------------> se mueve de tal forma de que va girando poco a poco hacia la derecha
       // Gira a la der
       digitalWrite(IN1, LOW);
       digitalWrite(IN2, HIGH);
       digitalWrite(IN3, HIGH);
       digitalWrite(IN4, LOW);
       delay(2000);
       // Gira a la izq
       digitalWrite(IN1, HIGH);
       digitalWrite(IN2, LOW);
       digitalWrite(IN3, LOW);
       digitalWrite(IN4, HIGH);
       delay(2000);
       // se detiene
       digitalWrite(IN1, LOW);
       digitalWrite(IN2, LOW);
       digitalWrite(IN3, LOW);
       digitalWrite(IN4, LOW);
       delay(1000);
       // Gira a la izq
       digitalWrite(IN1, HIGH);
       digitalWrite(IN2, LOW);
       digitalWrite(IN3, LOW);
       digitalWrite(IN4, HIGH);
       delay(2000);
       // Gira a la der
       digitalWrite(IN1, LOW);
       digitalWrite(IN2, HIGH);
       digitalWrite(IN3, HIGH);
       digitalWrite(IN4, LOW);
       delay(2000);
       b = 0;
       presence = 100; // le indica que ya termino de moverse
       sonar_data = String(LeftSensor) + "<" + String(FrontSensor) + ">" + String(RightSensor)+ "%" + presence + "&" + b;
       Serial.println(sonar_data);
       delay(1000);
       presence = 0; // le indica que ya termino de moverse
       sonar_data = String(LeftSensor) + "<" + String(FrontSensor) + ">" + String(RightSensor)+ "%" + presence + "&" + b;
       Serial.println(sonar_data);
   }

   // si no dectecta presencia apaga motores
   digitalWrite(IN1, LOW);
   digitalWrite(IN2, LOW);
   digitalWrite(IN3, LOW);
   digitalWrite(IN4, LOW);

 // if (presence == 0){ // si no encuentra a nadie cominza contador
    b++;
 // }

  
      
  }// fin autonomo

 
  
  delay(200);



  // Comunication
   while (Serial.available())
   {
        char character = Serial.read();
        if (character != '@')
        {
           data[dataIndex] = character;
           dataIndex ++;
        }
        else
        {
              //Serial.println(data); // muestra lo que llega
              String str(data); // convierte los caracteres en una String / formato entrada ABC= magnitud el resto el valor
              valor = str.substring(3, str.length()); // separa la magnitud de la data y deja el valor
              //Serial.println(str.substring(0, 3)); // muetra el comando
              //Serial.println(valor); //muestra valor del comando
              
              if (str.substring(0, 3) == "fon") {
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, HIGH);
                digitalWrite(IN3, LOW);
                digitalWrite(IN4, HIGH);
                autonomo = false;
              }
              if (str.substring(0, 3) == "bac") {
                digitalWrite(IN1, HIGH);
                digitalWrite(IN2, LOW);
                digitalWrite(IN3, HIGH);
                digitalWrite(IN4, LOW);
                autonomo = false;
              }
              if (str.substring(0, 3) == "rig") {
                digitalWrite(IN1, HIGH);
                digitalWrite(IN2, LOW);
                digitalWrite(IN3, LOW);
                digitalWrite(IN4, HIGH);
                autonomo = false;
              }
              if (str.substring(0, 3) == "lef") {
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, HIGH);
                digitalWrite(IN3, HIGH);
                digitalWrite(IN4, LOW);
                autonomo = false;
              }
              if (str.substring(0, 3) == "sto") {
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, LOW);
                digitalWrite(IN3, LOW);
                digitalWrite(IN4, LOW);
                autonomo = false;
                presence = 0;
                 m=0;
                 p=0;
                 k=0;
              }
              if (str.substring(0, 3) == "red") {
                Dato = str.substring(3, str.length());
                analogWrite(red, Dato.toInt());
                //Serial.println(Dato);
              }
              if (str.substring(0, 3) == "blu") {
                Dato = str.substring(3, str.length());
                analogWrite(blue, Dato.toInt());
              }
              if (str.substring(0, 3) == "gre") {
                Dato = str.substring(3, str.length());
                analogWrite(green, Dato.toInt());
              }
              if (str.substring(0, 3) == "aut") {
               autonomo = true;
               presence = 0;
               m=0;
               p=0;
               k=0;
              }
              
              dataIndex = 0;
              Dato = "";
              str = "";
              character = "";
              memset(data,0,sizeof(data)); //clear char
        }
    }// fin del while

}// fin del loop




void SonarSensor(int trigPin,int echoPin)
{
digitalWrite(trigPin, LOW);
delayMicroseconds(2);
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);
duration = pulseIn(echoPin, HIGH);
distance = (duration/2) / 29.1;
}
