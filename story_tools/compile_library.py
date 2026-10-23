from pathlib import Path
import re,json,unicodedata,collections,sys
B=Path(__file__).resolve().parents[1]
T=B/'story_tools'/'texts'
WORD=re.compile(r"(?:[^\W\d_]+(?:['’][^\W\d_]+)*|\d+(?::\d+)?)",re.U)
# Conservative, human-authored high-usage Spanish/German glossary. Later Palabra Studio replaces
# heuristic enrichment with an NLP draft + manual approval, using this same versioned format.
CORE='''
a=an;al=zum;de=von;del=vom;el=der;la=die;los=die;las=die;un=ein;una=eine;unos=einige;unas=einige;y=und;o=oder;pero=aber;que=dass;qué=was;quién=wer;quiénes=wer;cómo=wie;cuándo=wann;dónde=wo;por=für / durch;para=für / um zu;en=in / auf;con=mit;sin=ohne;se=sich;me=mich / mir;te=dich / dir;lo=ihn / es;le=ihm / ihr;les=ihnen;nos=uns;os=euch;su=sein / ihr;sus=seine / ihre;mi=mein;mis=meine;tu=dein;tus=deine;yo=ich;tú=du;él=er;ella=sie;ellos=sie;ellas=sie;usted=Sie;ustedes=Sie;nosotros=wir;vosotros=ihr;esto=dies;eso=das;esa=diese;ese=dieser;este=dieser;esta=diese;estas=diese;estos=diese;allí=dort;aquí=hier;ahí=da;ya=schon / jetzt;todavía=noch;ahora=jetzt;antes=vorher;después=danach;entonces=dann;cuando=als / wenn;porque=weil;como=wie;si=wenn / ob;sí=ja;no=nein / nicht;ni=auch nicht / weder;solo=nur / allein;sola=allein;solos=allein;muy=sehr;mucho=viel;muchos=viele;muchas=viele;mucha=viel;más=mehr;menos=weniger;tan=so;todo=alles;toda=ganze;todos=alle;todas=alle;algo=etwas;alguien=jemand;nadie=niemand;nada=nichts;otro=anderer;otra=andere;otros=andere;otras=andere;uno=eins;dos=zwei;tres=drei;cuatro=vier;cinco=fünf;seis=sechs;siete=sieben;ocho=acht;nueve=neun;diez=zehn;doce=zwölf;treinta=dreißig;primero=zuerst;primera=erste;segundo=zweite;segunda=zweite;último=letzte;última=letzte;bien=gut;mal=schlecht;bueno=gut;buena=gut;malas=schlecht;claro=klar;clara=klar;quizá=vielleicht;quizás=vielleicht;tal=vielleicht;vez=Mal;veces=Male;siempre=immer;nunca=nie;casi=fast;también=auch;tampoco=auch nicht;incluso=sogar;además=außerdem;sin embargo=jedoch;por suerte=zum Glück;por supuesto=natürlich;al menos=wenigstens;un poco=ein bisschen;muchísimo=sehr viel;demasiado=zu viel;perfecto=perfekt;perfecta=perfekt;vale=okay;vaya=oh Mann;oye=hör mal;ah=ach;ay=ach;eh=äh;oh=oh;hola=hallo;adiós=tschüss;gracias=danke;perdón=Entschuldigung;disculpe=Entschuldigen Sie;miau=miau;clac=klack;fin=Ende
pablo=Pablo;coco=Coco;clara=Clara;rosa=Rosa;paula=Paula;nico=Nico;inés=Inés;carmen=Carmen;esteban=Esteban;luna=Luna;madrid=Madrid;parís=Paris;roma=Rom;cine=Kino;gato=Kater / Katze;gata=Katze;gatos=Katzen;hermana=Schwester;hermano=Bruder;hermanos=Geschwister;primo=Cousin;abuela=Großmutter;abuelo=Großvater;padre=Vater;madre=Mutter;papá=Papa;mamá=Mama;familia=Familie;casa=Haus / Zuhause;piso=Wohnung / Stockwerk;edificio=Gebäude;puerta=Tür;puertas=Türen;ventana=Fenster;ventanas=Fenster;salón=Wohnzimmer;dormitorio=Schlafzimmer;cocina=Küche;baño=Badezimmer;mesa=Tisch;sofá=Sofa;cama=Bett;silla=Stuhl;sillas=Stühle;butaca=Kinosessel;butacas=Kinosessel;banco=Bank;bancos=Bänke;pared=Wand;paredes=Wände;techo=Decke;suelo=Boden;escaleras=Treppen;entrada=Eingang / Eintritt;salida=Ausgang / Abfahrt;calle=Straße;calles=Straßen;plaza=Platz;pueblo=Ort / Dorf;ciudad=Stadt;centro=Zentrum;estación=Bahnhof;tren=Zug;trenes=Züge;andén=Bahnsteig;billete=Fahrkarte;billetes=Fahrkarten;viaje=Reise;viajar=reisen;viajero=Reisender;viajeros=Reisende;maleta=Koffer;maletas=Koffer;bolsa=Tasche;tela=Stoff;mochila=Rucksack;transportín=Transportbox;ropa=Kleidung;camiseta=T-Shirt;camisetas=T-Shirts;pantalones=Hose;jersey=Pullover;zapatos=Schuhe;calcetín=Socke;rojo=rot;roja=rot;rojas=rot;azul=blau;naranja=orange;amarillo=gelb;amarilla=gelb;dorado=golden;doradas=goldene;verde=grün;verdes=grün;blanco=weiß;blanca=weiß;negro=schwarz;negra=schwarz;pequeño=klein;pequeña=klein;pequeñas=kleine;grande=groß;grandes=groß;antiguo=alt;antigua=alt;antiguas=alte;viejo=alt;vieja=alt;nuevo=neu;nueva=neu;nuevos=neue;bonito=schön;bonita=schön;precioso=wunderschön;preciosa=wunderschön;especial=besonders;extraño=seltsam;extraña=seltsam;tranquilo=ruhig;tranquila=ruhig;feliz=glücklich;contento=zufrieden;contenta=zufrieden;triste=traurig;cansado=müde;cansada=müde;solo=allein;sola=allein;difícil=schwierig;fácil=einfach;importante=wichtig;seguro=sicher;segura=sicher;interesante=interessant;curioso=merkwürdig;curiosa=neugierig;imposible=unmöglich;posible=möglich;correcta=richtig;correcto=richtig;mejor=besser;peor=schlechter;favorito=Lieblings-;favorita=Lieblings-;enorme=riesig;enormes=riesig;lleno=voll;llena=voll;vacío=leer;vacía=leer;abierto=offen;abierta=offen;cerrado=geschlossen;cerrada=geschlossen;libre=frei;directo=direkt;propio=eigen;propia=eigen;personal=persönlich;familiares=Familien-;totalmente=völlig;lentamente=langsam;rápidamente=schnell;finalmente=schließlich;aparentemente=anscheinend;especialmente=besonders;precisamente=genau;simplemente=einfach;completamente=vollständig;perfectamente=perfekt;seguramente=wahrscheinlich;probablemente=wahrscheinlich;inmediatamente=sofort;normalmente=normalerweise;exactamente=genau;alrededor=herum;dentro=drinnen;fuera=draußen;encima=darauf;debajo=darunter;detrás=dahinter;delante=davor;frente=gegenüber;junto=neben;lado=Seite;derecha=rechts;izquierda=links;cerca=nah;lejos=weit;hacia=in Richtung;hasta=bis;entre=zwischen;sobre=über / auf;desde=seit / von;durante=während;contra=gegen;según=gemäß;tras=nach;cada=jeder;ayer=gestern;hoy=heute;mañana=morgen / Vormittag;tarde=Nachmittag / spät;noche=Nacht;noches=Nächte;día=Tag;días=Tage;semana=Woche;semanas=Wochen;mes=Monat;meses=Monate;año=Jahr;años=Jahre;hora=Stunde / Uhrzeit;horas=Stunden;minutos=Minuten;segundo=Sekunde / zweite;segundos=Sekunden;momento=Moment;momentos=Momente;tiempo=Zeit;tiempos=Zeiten;viernes=Freitag;jueves=Donnerstag;sábado=Samstag;domingo=Sonntag;lunes=Montag;verano=Sommer;invierno=Winter;cumpleaños=Geburtstag;fiesta=Fest;fiestas=Feste;vacaciones=Ferien / Urlaub;trabajo=Arbeit;estudios=Studium;obligaciones=Verpflichtungen;responsabilidad=Verantwortung;decisión=Entscheidung;definitiva=endgültig;ayuntamiento=Rathaus / Stadtverwaltung;aparcamiento=Parkplatz;reparaciones=Reparaturen;reparación=Reparatur;dinero=Geld;público=Publikum / öffentlich;personas=Menschen;persona=Person;mujer=Frau;mujeres=Frauen;hombre=Mann;hombres=Männer;joven=jung / junge Person;niña=Mädchen;niño=Junge;niños=Kinder;vecinos=Nachbarn;vecina=Nachbarin;vecino=Nachbar;señora=Dame;señor=Herr;empleado=Mitarbeiter;empleada=Mitarbeiterin;profesor=Lehrer;estudiantes=Schüler / Studierende;amigo=Freund;amiga=Freundin;amigos=Freunde;dueño=Besitzer;propietario=Eigentümer;abuelos=Großeltern
libro=Buch;libros=Bücher;álbum=Fotoalbum;fotografía=Fotografie;fotografías=Fotografien;foto=Foto;fotos=Fotos;página=Seite;páginas=Seiten;papel=Papier;papeles=Papiere;mensaje=Nachricht;mensajes=Nachrichten;móvil=Handy;teléfono=Telefon;cámara=Kamera;linterna=Taschenlampe;pantalla=Leinwand / Bildschirm;imagen=Bild;imágenes=Bilder;película=Film;películas=Filme;función=Vorstellung;funciones=Vorstellungen;sesión=Vorführung;sesiones=Vorführungen;proyector=Filmprojektor;proyección=Filmvorführung;sala=Saal / Raum;salas=Säle;fila=Reihe;filas=Reihen;asiento=Sitzplatz;asientos=Sitzplätze;cartel=Plakat / Schild;carteles=Plakate;letras=Buchstaben;letra=Buchstabe;invitación=Einladung;invitaciones=Einladungen;ventanilla=Ticketschalter;escaparate=Schaufenster;cristal=Glas;cadena=Kette;polvo=Staub;humedad=Feuchtigkeit;madera=Holz;pintura=Farbe / Malerei;paredes=Wände;estrella=Stern;estrellas=Sterne;balcón=Balkon;balcones=Balkone;colores=Farben;olor=Geruch;aire=Luft;luz=Licht;luces=Lichter;oscuridad=Dunkelheit;sombra=Schatten;sombras=Schatten;ruido=Geräusch;ruidos=Geräusche;silencio=Stille;sonido=Ton;máquina=Maschine;herramientas=Werkzeuge;caja=Kiste / Schachtel;cajas=Kisten;botella=Flasche;vaso=Glas;café=Kaffee;comida=Essen;agua=Wasser;pescado=Fisch;pan=Brot;bocadillos=belegte Brote;bocadillo=belegtes Brot;tarta=Kuchen;palomitas=Popcorn;desayunar=frühstücken;cenar=zu Abend essen;comer=essen;beber=trinken;hambre=Hunger;apetito=Appetit;ropa=Kleidung;regalo=Geschenk;regalos=Geschenke;recuerdo=Erinnerung;recuerdos=Erinnerungen;infancia=Kindheit;historia=Geschichte;historias=Geschichten;aventura=Abenteuer;aventuras=Abenteuer;viajes=Reisen;sorpresa=Überraschung;sorpresas=Überraschungen;noticia=Nachricht;noticias=Nachrichten;problema=Problem;problemas=Probleme;solución=Lösung;soluciones=Lösungen;posibilidad=Möglichkeit;opinión=Meinung;idea=Idee;ideas=Ideen;plan=Plan;planes=Pläne;pregunta=Frage;preguntas=Fragen;respuesta=Antwort;respuestas=Antworten;conversación=Gespräch;conclusión=Schlussfolgerung;experiencia=Erfahrung;emociones=Gefühle;emoción=Gefühl;alegría=Freude;tristeza=Traurigkeit;miedo=Angst;curiosidad=Neugier;sonrisa=Lächeln;carcajada=lautes Lachen;risa=Lachen;lágrimas=Tränen;lágrima=Träne;ojos=Augen;ojo=Auge;oreja=Ohr;cara=Gesicht;cabeza=Kopf;pelo=Haar;mano=Hand;manos=Hände;brazo=Arm;brazos=Arme;pata=Pfote;patas=Pfoten;boca=Mund;nariz=Nase;piernas=Beine;dedo=Finger;dedos=Finger;corazón=Herz;espalda=Rücken;hombro=Schulter;hombros=Schultern;mesa=Tisch;manta=Decke;mantas=Decken;globo=Luftballon;mariposa=Schmetterling;cordel=Schnur;periódico=Zeitung;gafas=Brille;reloj=Uhr;bolsillo=Tasche;sombrero=Hut;árboles=Bäume;río=Fluss;lluvia=Regen;camino=Weg;playa=Strand;mar=Meer;campos=Felder;campo=Feld;bicicletas=Fahrräder;bicicleta=Fahrrad;músicos=Musiker;música=Musik;panadería=Bäckerei;barbacoa=Grillfest;fuego=Feuer;tienda=Geschäft;tiendas=Geschäfte;acera=Gehweg;aceras=Gehwege;puente=Brücke;orilla=Ufer;edificios=Gebäude;edificio=Gebäude;celebración=Feier;celebraciones=Feiern
'''
LEX={}
for line in CORE.strip().splitlines():
 for pair in line.split(';'):
  if '=' not in pair:continue
  k,v=pair.split('=',1)
  LEX[k.strip().casefold()]=v.strip()
for line in (B/'story_tools/extra_glossary.tsv').read_text().splitlines():
 for pair in line.split(';'):
  if '=' in pair:
   key,value=pair.split('=',1);LEX[key.strip().casefold()]=value.strip()
# Additional past-tense forms and irregular verbs need their own explicit lemma.
VERBS='''
ser|sein|es,soy,eres,somos,son,era,eran,eras,fue,fueron,fuera,sería,serían,siendo,sido,seré,será
estar|sein / sich befinden|está,están,estoy,estás,estamos,estaba,estaban,estuve,estuvieron,estaría,estando,estado
haber|haben (Hilfsverb)|he,has,ha,hemos,habéis,han,había,habían,habías,hubo,hubiera,habrá,habría,habiendo
ir|gehen / fahren|voy,vas,va,vamos,vais,van,fui,fue,fuimos,fueron,iba,iban,iría,iré,iremos,ido
hacer|machen / tun|hago,haces,hace,hacemos,hacen,hizo,hicieron,hiciste,hacía,hacían,haría,haremos,haciendo,hecho
poder|können|puedo,puedes,puede,podemos,pueden,pudo,pudiera,pudieran,podía,podían,podría,podríamos,podéis,pudiendo
querer|wollen / mögen|quiero,quieres,quiere,queremos,quieren,quería,querían,quiso,quisieron,querría,queriendo
saber|wissen / können|sé,sabes,sabe,sabemos,saben,sabía,sabían,supo,sabría
ver|sehen|veo,ves,ve,vemos,ven,vi,vio,vieron,veía,veían,visto,viendo
mirar|anschauen|mira,miró,miraron,mirando,miraba,miraban,miramos,miraste
abrir|öffnen|abre,abrió,abrieron,abierto,abriendo,abría,abrían,abrimos
cerrar|schließen|cierra,cerró,cerraron,cerrado,cerrando,cerraba,cerró
salir|hinausgehen / abfahren|sale,salen,salgo,salió,salieron,salíamos,salir,salido,saliendo
llegar|ankommen|llega,llegó,llegaron,llegaba,llegaban,llegamos,llegaría
entrar|hineingehen|entra,entró,entraron,entrando,entramos,entraba
llevar|tragen / mitnehmen|lleva,llevaba,llevaban,llevó,llevaron,llevando,llevamos,llevas
traer|bringen|trae,traigo,trajo,traían,traído,traído,traían,trajeron
comprar|kaufen|compra,compró,compraron,comprando,compraba,compraron,compramos
poner|legen / stellen|pone,pongo,puso,pusieron,ponía,ponían,puesto,poniendo,ponemos
preparar|vorbereiten|prepara,preparó,preparando,preparado,prepararon,preparaban,preparamos
pensar|denken|piensa,pienso,pensó,pensaban,pensando,pensaba,pensado,pensaron
hablar|sprechen|habla,habló,hablaron,hablaban,hablando,hablado,hablamos
preguntar|fragen|pregunta,preguntó,preguntaron,preguntaba,preguntando
responder|antworten|responde,respondió,respondieron,respondiendo,respondía
contar|erzählen / zählen|cuenta,contó,contaron,contaba,contaban,contando,contado
explicar|erklären|explica,explicó,explicaron,explicando,explicaba
escuchar|zuhören / hören|escucha,escuchó,escucharon,escuchando,escuchaba
sentir|fühlen|siente,sintió,sintieron,sentía,sentían,sentiría,sintiéndose
recordar|sich erinnern|recuerda,recordaba,recordaban,recordó,recordaron,recordando
olvidar|vergessen|olvida,olvidó,olvidado,olvidaba,olvidaron,olvidando
mirar|anschauen|mira,miró,miraron,miraba,mirando,miraban
llamar|rufen / anrufen|llama,llamó,llamaron,llamaba,llamaban,llamando
volver|zurückkehren|vuelve,volvió,volvieron,volvía,volviendo,volvemos,volvería
empezar|beginnen|empieza,empezó,empezaron,empezaba,empezaban,empezamos,empezando
comenzar|beginnen|comienza,comenzó,comenzaron,comenzaban,comenzando,comenzaba
terminar|beenden|termina,terminó,terminaron,terminando,terminado
quedar|bleiben / sich verabreden|queda,quedó,quedaron,quedaba,quedaban,quedó,quedamos
parecer|scheinen / wirken|parece,parecía,parecieron,parecían,pareció,parezcan
sonreír|lächeln|sonríe,sonrió,sonreían,sonriendo,sonreía,sonrieron
reír|lachen|ríe,rió,riendo,reírse,reía,reían,rieron,reído
reírse|lachen|reírse,riéndose,riendo
buscar|suchen|busca,buscó,buscaron,buscando,buscaba,buscaban
encontrar|finden|encuentra,encontró,encontraron,encontraba,encontrado,encontrando
perder|verlieren / verpassen|pierde,perdió,perdieron,perdido,perdían,perdiendo,perderíamos
conseguir|schaffen / bekommen|consigue,consiguió,consiguieron,conseguido,conseguía
necesitar|brauchen|necesita,necesitan,necesito,necesitaba,necesitaban
intentar|versuchen|intenta,intentó,intentaron,intentaba,intentando
ayudar|helfen|ayuda,ayudó,ayudaron,ayudando,ayudaba,ayudarme
vivir|leben / wohnen|vive,vivía,vivían,viviendo,vivido,vivimos
morir|sterben|murió,muerto,murieron
cumplir|erfüllen / Geburtstag haben|cumple,cumplía,cumplían,cumplido,cumplieron
ocurrir|passieren|ocurre,ocurrió,ocurrido,ocurría
pasar|passieren / verbringen|pasa,pasó,pasaron,pasaba,pasaban,pasando,pasará
seguir|folgen / weitermachen|sigue,siguió,siguiendo,seguían,seguía,seguiría
jugar|spielen|juega,jugó,jugaban,jugaba,jugando
mover|bewegen|mueve,movió,moviendo,movía,movían
saltarse|überspringen|salta,saltó,saltaron,saltando
saltar|springen|salta,saltó,saltaron,saltando
correr|rennen|corre,corrió,corrieron,corriendo,corría
subir|hochgehen|sube,subió,subieron,subiendo,subían
bajar|hinuntergehen|baja,bajó,bajaron,bajando,bajaban
sentarse|sich setzen|sienta,sentó,sentaron,sentado,sentada,sentándose,sentarse
coger|nehmen / greifen|coge,cogió,cogieron,cogiendo,cogía
sacar|herausnehmen|saca,sacó,sacaron,sacando,sacado
meter|hineinlegen / stecken|mete,metió,metieron,metiendo,metido
meterse|hineingehen / sich hineinbegeben|metió,metido,meterse
escoger|aussuchen|escoge,escogió,escogieron,escogido
comprender|verstehen|comprende,comprendió,comprendido
entender|verstehen|entiendo,entiende,entendió,entendieron,entendía,entendido,entendamos
reconocer|wiedererkennen|reconoce,reconoció,reconocieron,reconociendo
enseñar|zeigen / beibringen|enseña,enseñó,enseñaron,enseñando
mostrar|zeigen|muestra,mostró,mostraron,mostrando
señalar|zeigen / auf etwas deuten|señala,señaló,señalaron,señalando
cuidar|sich kümmern|cuida,cuidaba,cuidaban,cuidando,cuidado
trabajar|arbeiten|trabaja,trabajó,trabajaban,trabajaba,trabajando,trabajado
estudiar|studieren / lernen|estudia,estudió,estudiaba,estudiando,estudiado
limpiar|reinigen|limpia,limpió,limpiaban,limpiando,limpiado
encender|einschalten / anzünden|enciende,encendió,encendieron,encendido,encendían,encendía
apagar|ausschalten / löschen|apaga,apagó,apagaban,apagaron,apagarse,apagado
abrirse|sich öffnen|abrieron,abría,abierto
aparecer|erscheinen|aparece,apareció,aparecieron,aparecía,aparecían
mirar|ansehen|mira,miró,miraron,mirando
observar|beobachten|observa,observó,observaban,observando
parar|anhalten|para,paró,pararon,parando
caminar|gehen / laufen|camina,caminó,caminaron,caminaba,caminando
regresar|zurückkommen|regresa,regresó,regresaron,regresaba
repetir|wiederholen|repite,repitió,repitieron,repitiendo
leer|lesen|lee,leía,leían,leyó,leyeron,leyendo,leído
escribir|schreiben|escribe,escribió,escribieron,escribiendo,escrito
recoger|abholen / aufheben|recoge,recogió,recogieron,recogiendo
ofrecer|anbieten|ofrece,ofreció,ofrecieron,ofreciendo,ofrecido
organizar|organisieren|organiza,organizó,organizado,organizando
pagar|bezahlen|paga,pagó,pagando,pagado
cambiar|ändern / wechseln|cambia,cambió,cambiaron,cambiando,cambiado
explicar|erklären|explicó,explicaron,explica,explicando,explicado
saludar|grüßen|saluda,saludó,saludaron,saludando
llorar|weinen|llora,lloró,llorando,lloraba,lloraban
abrazar|umarmen|abraza,abrazó,abrazaron,abrazando
mostrar|zeigen|mostró,muestra,mostraron
aplaudir|applaudieren|aplaude,aplaudió,aplaudieron,aplaudiendo
levantarse|aufstehen|se,levantó,levanta,levantarse,levantaron,levantaba
sorprender|überraschen|sorprende,sorprendió,sorprendida,sorprendido
colocar|hinstellen / anordnen|coloca,colocó,colocaron,colocando,colocadas
reparar|reparieren|repara,reparó,repararon,reparado,reparando
revisar|überprüfen|revisa,revisó,revisaron,revisando,revisaba
servir|dienen / servieren|sirve,sirvió,sirvieron,sirviendo
reírse|lachen|se,rió,rieron,reírse,riéndose
quitar|wegnehmen|quita,quitó,quitaban,quitando
mantener|erhalten / bewahren|mantiene,mantenía,mantener,mantenido
crear|erschaffen|crea,creó,crearon,creando,creado
conocer|kennen / kennenlernen|conoce,conoció,conocían,conocido,conociendo
llevarse|mitnehmen / sich verstehen|llevarse,llevó,llevaba,llevaban
haber de|müssen / sollen|había
'''

VERBS += """
tener|haben|tengo,tienes,tiene,tenemos,tenéis,tienen,tenía,tenían,tenías,tuve,tuvieron,teniendo,tenido
decir|sagen|digo,dices,dice,decimos,dicen,dijo,dijeron,dijiste,decía,decían,diría,digas,diciendo,dicho
dar|geben|doy,das,da,damos,dan,dio,dieron,daba,daban,daré,daría,daban,dado
dormir|schlafen|duermo,duermes,duerme,dormimos,duermen,durmió,durmieron,durmiendo,dormido
venir|kommen|vengo,vienes,viene,venimos,venís,vienen,venía,venían,vendrá,vendría,venido
gustar|gefallen|gusta,gustan,gustó,gustaba,gustaría,gustando
creer|glauben|creo,crees,cree,creemos,creen,creía,creían,creyó,creyeron,creído
dejar|lassen / hinterlassen|deja,dejó,dejaron,dejaba,dejaban,dejando,dejado
descubrir|entdecken|descubre,descubrió,descubrieron,descubierto,descubriendo
decidir|entscheiden|decide,decidió,decidieron,decidiendo,decidido,decidimos
susurrar|flüstern|susurra,susurró,susurraban,susurrando
murmurar|murmeln|murmura,murmuró,murmuraron,murmurando
suspirar|seufzen|suspira,suspiró,suspiraron,suspirando
acercarse|sich nähern|acercó,acercaron,acercaba,acercaban,acercándose
acabar|beenden / gerade etwas tun|acaba,acabó,acababan,acabando,acababa,acabado,acabará
detenerse|anhalten / stehen bleiben|detuvo,detuvieron,detenido,deteniéndose
desaparecer|verschwinden|desaparece,desapareció,desaparecieron,desapareciera,desaparezca
elegir|wählen|elige,eligió,eligieron,elegían,elegía,elegido
esconderse|sich verstecken|escondió,escondido,escondía,escondieron,escondidas
comprender|verstehen|comprende,comprendió,comprendido
permanecer|bleiben|permanece,permanecido,permaneció,permanecían
construir|bauen|construye,construyó,construyeron,construir,construido
existir|existieren|existe,existía,existieron,existía
prometer|versprechen|promete,prometió,prometieron,prometer
demostrar|zeigen / beweisen|demuestra,demostró,demostraron,demostrar
significar|bedeuten|significa,significó,significaba,significar
poder|können|puede,pueden,puedo,puedes,puedas,podemos,pudieron,podría,podríamos
"""

VFORMS={}
VLEMMA={}
for line in VERBS.strip().splitlines():
 if not line.strip():continue
 lemma,de,forms=line.split('|')
 VLEMMA.setdefault(lemma,de)
 for form in forms.split(','):
  # First meaning wins unless verb supplied precise override below
  if form not in ('se',):VFORMS.setdefault(form.casefold(),(lemma,de))
VFORMS.update({'fue':('ser/ir','war / ging'),'fueron':('ser/ir','waren / gingen'),'fui':('ser/ir','war / ging'),'como':('como/comer','wie / ich esse')})
NAMES={'coco','pablo','paula','nico','inés','carmen','rosa','clara','esteban','madrid','parís','roma','luna'}
FUNCTION={'a':'preposition','al':'preposition','de':'preposition','del':'preposition','por':'preposition','para':'preposition','en':'preposition','con':'preposition','sin':'preposition','entre':'preposition','sobre':'preposition','desde':'preposition','hasta':'preposition','hacia':'preposition','tras':'preposition','contra':'preposition','según':'preposition','y':'conjunction','o':'conjunction','pero':'conjunction','que':'conjunction','porque':'conjunction','cuando':'conjunction','si':'conjunction','aunque':'conjunction','mientras':'conjunction','entonces':'adverb','no':'particle','ni':'particle','el':'determiner','la':'determiner','los':'determiner','las':'determiner','una':'determiner','un':'determiner','unos':'determiner','unas':'determiner','su':'determiner','sus':'determiner','mi':'determiner','mis':'determiner','tu':'determiner','tus':'determiner','esta':'determiner','este':'determiner','esa':'determiner','ese':'determiner','esto':'pronoun','eso':'pronoun','yo':'pronoun','tú':'pronoun','él':'pronoun','ella':'pronoun','ellos':'pronoun','ellas':'pronoun','nosotros':'pronoun','vosotros':'pronoun','me':'pronoun','te':'pronoun','se':'pronoun','le':'pronoun','les':'pronoun','lo':'pronoun','nos':'pronoun','os':'pronoun','qué':'pronoun','quién':'pronoun','quiénes':'pronoun','cuál':'pronoun','cómo':'adverb','dónde':'adverb','cuándo':'adverb','más':'adverb','menos':'adverb','muy':'adverb','bien':'adverb','mal':'adverb','ya':'adverb','ahora':'adverb','aquí':'adverb','allí':'adverb','ahí':'adverb','sí':'adverb','también':'adverb','tampoco':'adverb','nunca':'adverb','siempre':'adverb','todavía':'adverb'}
IRREGULAR_FORM_HINT={'era':'Imperfecto','eran':'Imperfecto','estaba':'Imperfecto','estaban':'Imperfecto','había':'Imperfecto / Plusquamperfekt-Hilfsverb','habían':'Imperfecto / Plusquamperfekt-Hilfsverb','fue':'Indefinido','fueron':'Indefinido','fui':'Indefinido','habéis':'Präsens, 2. Person Plural (Spanien)','he':'Präsens Hilfsverb','ha':'Präsens Hilfsverb','hemos':'Präsens Hilfsverb','han':'Präsens Hilfsverb'}
# Standard learned-card glossary supplements curated story glossary.
seed=(B/'words.js').read_text().split('window.PALABRA_SEED=',1)[1].split('];',1)[0]+']'
VOCAB=json.loads(seed)
VREF={}
for w in VOCAB:
 term=w['es'].casefold().strip()
 for candidate in [term,re.sub(r'^(?:el|la|los|las)\s+','',term)]:
  if len(WORD.findall(candidate))==1:VREF.setdefault(candidate,[]).append(w)
for key,ws in VREF.items():
 if key not in LEX and len(ws)==1:LEX[key]=ws[0]['de'].replace('der ','').replace('die ','').replace('das ','')
NOUN_ENDINGS=('ción','dad','tad','umbre','aje','ante','ente','or','ora','ión')
ADJ_ENDINGS=('oso','osa','able','ible','ivo','iva','al','ente','ante')
# Underived forms remain flagged transparently rather than made-up translations.
WB={}
for line in (B/'story_tools/wordbank.tsv').read_text().splitlines():
 f=line.split('|')
 if len(f)>=6: WB[f[0].lower()]=f
def enrich(surface):
 w=surface.casefold();lemma=w
 if w in WB:
  f=WB[w];out={'lemma':f[1],'pos':f[2],'de':LEX.get(w,f[3]),'form':f[4],'note':f[5]}
  if len(f)>6 and f[6].strip() and f[6].strip()!=out['de']:out['literal']=f[6].strip()
  return out
 if w in NAMES:return {'lemma':surface[0].upper()+surface[1:],'pos':'name','de':surface[0].upper()+surface[1:],'form':'Eigenname','note':'Name einer Figur oder eines Ortes.'}
 if w in VFORMS:
  lemma,de=VFORMS[w]
  form=IRREGULAR_FORM_HINT.get(w,'Verbform · Grundform: '+lemma)
  if w.endswith(('ando','iendo')):form='Gerundium (Verlaufsform)'
  elif w.endswith(('ado','ido')):form='Partizip'
  elif w.endswith(('aba','ía','aban','ían')):form='Imperfecto (Vergangenheit)'
  elif w.endswith(('ó','aron','ieron','í','iste')):form='Indefinido (abgeschlossene Vergangenheit)'
  elif w.endswith(('ar','er','ir')):form='Infinitiv'
  out={'lemma':lemma,'pos':'verb','de':LEX.get(w,de),'form':form,'note':'Die Wortform gehört zum Verb „'+lemma+'“.'}
  if w in ('levantó','levantarse','levantaba'):out['literal']='sich erhob / sich erheben'
  return out
 if w.endswith(('ando','iendo')):
  root=w[:-4] if w.endswith('ando') else w[:-5]
  inf=root+('ar' if w.endswith('ando') else 'er')
  return {'lemma':inf,'pos':'verb','de':LEX.get(w,'während '+inf+' (Verlaufsform)'),'form':'Gerundium · andauernde Handlung','note':'Das Gerundium beschreibt eine laufende oder begleitende Tätigkeit.'}
 if w.endswith(('ar','er','ir')) and len(w)>3 and (w in VLEMMA or w not in LEX):
  return {'lemma':w,'pos':'verb','de':LEX.get(w,VLEMMA.get(w,'Bedeutung zur Endkontrolle vorgemerkt')),'form':'Infinitiv','note':'Ungebeugte Grundform eines Verbs.'}
 pos=FUNCTION.get(w)
 if not pos:
  if w.isdigit() or re.fullmatch(r'\d+(?::\d+)?',w):pos='numeral'
  elif w.endswith(('mente',)):pos='adverb'
  elif w.endswith(ADJ_ENDINGS):pos='adjective'
  else:pos='noun'
 # do not pretend a missing translation is known
 de=LEX.get(w)
 if de is None and re.fullmatch(r'\d+(?::\d+)?',w):de=w.replace(':',' Uhr ') if ':' in w else w
 if de is None:
  # gender / number / weak suffix normalization, without pretending that it always holds
  candidates=[w[:-1]+'o',w[:-1]+'a',w[:-1],w[:-2]+'o',w[:-2]+'a',w[:-2]] if w.endswith(('s','a','o')) else [w[:-1]]
  for stem in candidates:
   if stem in LEX:de=LEX[stem];lemma=stem;break
 if de is None:de='Noch nicht lexikalisch geprüft'
 return {'lemma':lemma,'pos':pos,'de':de,'form':{'noun':'Substantiv / Nomen','adjective':'Adjektiv','adverb':'Adverb','pronoun':'Pronomen','determiner':'Artikel / Begleiter','conjunction':'Konjunktion','preposition':'Präposition','particle':'Partikel','numeral':'Zahlwort'}.get(pos,'Wortart wird geprüft'),'note':'' if de!='Noch nicht lexikalisch geprüft' else 'Dieser Eintrag muss für die endgültige Veröffentlichung noch redaktionell überprüft werden.'}

def split_line(line):
 # Keep punctuation + dialog markers; split sentences only at boundary with whitespace.
 # Abbreviations uncommon in the authored stories; protect decimal and initials.
 if line.startswith(('«','“')) and re.search(r'\d+:\d+',line):return [line]
 parts=[];start=0
 for match in re.finditer(r'[.!?…]+(?:[»”"])?(?=\s|$)',line):
  end=match.end()
  if end<len(line) and line[end:].lstrip().startswith(('—','¡','¿')):
   pass
  text=line[start:end].strip()
  if text:parts.append(text)
  start=end
 tail=line[start:].strip()
 if tail:parts.append(tail)
 merged=[]
 for part in parts:
  if merged and re.match(r'^—(?:preguntó|dijo|respondió|repitió|gritó|susurró|murmuró|explicó|exclamó|decidió|anunció|dice)\b',part,re.I):
   merged[-1]+=' '+part
  else:merged.append(part)
 return merged

def chunks(tokens):
 # Contiguous syntax constituents: transparent heuristic draft, subject to Studio review.
 n=len(tokens)
 if not n:return []
 tag=[t['pos'] for t in tokens]; words=[t['text'].casefold() for t in tokens]
 finite=[i for i,t in enumerate(tokens) if t['pos']=='verb' and not t['form'].startswith(('Infinitiv','Partizip','Gerundium'))]
 # Unknown verbs: recognize common finite endings; overrides prefer known function words.
 for i,w in enumerate(words):
  if i in finite or tag[i] in ('conjunction','preposition','determiner','pronoun','adverb','particle','name'):continue
  if len(w)>3 and w.endswith(('aron','ieron','aban','ían','aba','ía','amos','emos','imos','aste','iste','aron','ió','ó')):
   finite.append(i);tag[i]='verb';tokens[i]['pos']='verb';tokens[i]['form']= 'Verbform (automatischer Vorschlag · prüfen)'
 finite.sort()
 # Key: do not colour arbitrary single words just to satisfy validation; group every span.
 roles=['adjunct']*n
 # Connector / negation spans independent of clause constituents.
 for i,w in enumerate(words):
  if w in ('y','pero','porque','aunque','si','que','mientras','o','ni'):roles[i]='connector'
  if w=='no':roles[i]='negation'
 for i in finite:
  roles[i]='predicate'
  # adjacent auxiliaries, reflexive/dative clitics, infinitives and gerunds (rough)
  if i>0 and words[i-1] in ('se','me','te','nos','os','le','les','lo','la') and (i==1 or words[i-2] not in ('a','de')):roles[i-1]='predicate'
  if i+1<n and tag[i+1]=='verb' and words[i+1] not in ('que',):roles[i+1]='predicate'
 # Introductory proper nouns/pronouns as subject and simple noun phrase boundaries.
 firstfinite=finite[0] if finite else n
 prefixstart=0
 while prefixstart<firstfinite and roles[prefixstart] in ('connector','negation'):prefixstart+=1
 if prefixstart<firstfinite:
  has_person=any(tag[i] in ('name','pronoun') and words[i] not in ('me','te','se','le','lo','la','nos') for i in range(prefixstart,firstfinite))
  # name+article noun phrase before first finite verb
  if has_person:
   for i in range(prefixstart,firstfinite):
    if tag[i] not in ('conjunction','preposition') and roles[i]!='negation':roles[i]='subject'
   # preceding date/time adverbs are adjuncts
   for i in range(prefixstart,firstfinite):
    if words[i] in ('ayer','hoy','mañana','anoche','entonces','antes','después','durante','cuando','aquella'):roles[i]='adjunct'
  elif firstfinite-prefixstart<=4 and words[prefixstart] in ('el','la','un','una','los','las','su','mi','este','esta'):
   for i in range(prefixstart,firstfinite):roles[i]='subject'
 # postverbal constituents: prepositional phrases, direct objects, copular complements.
 afterverb=bool(finite)
 index=0
 while index<n:
  w=words[index]
  if index in finite or roles[index] in ('subject','predicate','connector','negation'):
   index+=1;continue
  if afterverb and index>min(finite) and w in ('en','con','por','para','desde','hacia','sobre','del','al','entre','de','sin','hasta','junto','debajo','encima','detrás','delante'):
   stop=index+1
   while stop<n and stop not in finite and roles[stop] not in ('connector','negation','subject'):
    if stop>index+1 and words[stop] in ('en','con','por','para','desde','hacia','sobre','del','al','entre','sin'):
     break
    stop+=1
   for j in range(index,stop):roles[j]='adjunct'
   index=stop;continue
  if afterverb and index>min(finite) and roles[index]=='adjunct' and words[index] in ('un','una','el','la','los','las','otro','otra','dos','tres','sus','su','este','esta','ese','esa','mi','mis','nuestro','nuestra','aquella','aquel'):
   stop=index+1
   while stop<n and stop not in finite and roles[stop] not in ('connector','negation','subject'):
    if words[stop] in ('en','con','por','para','desde','hacia','sobre','del','al','entre','sin') and stop>index+1:break
    stop+=1
   role='attribute' if words[min(finite)] in ('es','era','está','estaba','son','están','eran') else 'direct'
   for j in range(index,stop):roles[j]=role
   index=stop;continue
  index+=1
 # ensure full coverage of word positions, use contiguous groups to prevent visual rainbow noise
 chunks=[]; start=0
 for i in range(1,n+1):
  if i==n or roles[i]!=roles[start]:
   chunks.append((roles[start],start,i))
   start=i
 return chunks

def relationships(tokens, syntax):
 words=[t['text'].casefold() for t in tokens];groups=[]
 def add(members, role,label,why):
  ids=list(dict.fromkeys(tokens[idx]['id'] for idx in members))
  if len(ids)>1:groups.append({'id':f'{tokens[0]["id"]}-g{len(groups)+1}','role':role,'label':label,'members':ids,'why':why})
 for i,w in enumerate(words):
  # Relatively unambiguous repetition of a clitic before an explicit a + proper name.
  if w in ('le','les','se'):
   for j in range(i+1,len(words)-1):
    if words[j]=='a' and tokens[j+1]['pos']=='name':
     add([i,j,j+1],'coreference','Empfängerbezug','Das Pronomen kann auf die nachgestellte Person verweisen. Kontext vor der Freigabe überprüfen.');break
 # Subject-verb concordance: only link a constituent already tagged as subject
 # to the adjacent finite predicate, without crossing a conjunction.
 for ui,unit in enumerate(syntax[:-1]):
  if unit['role']!='subject':continue
  nxt=syntax[ui+1]
  if nxt['role']!='predicate':continue
  member_ids=set(unit['members']);predicate_ids=set(nxt['members'])
  idx_subject=[i for i,t in enumerate(tokens) if t['id'] in member_ids]
  idx_verb=[i for i,t in enumerate(tokens) if t['id'] in predicate_ids]
  if not idx_subject or not idx_verb:continue
  verbidx=next((i for i in idx_verb if tokens[i]['pos']=='verb'),None)
  if verbidx is None:continue
  add(idx_subject+[verbidx],'agreement','Subjekt und konjugiertes Verb','Das Verb stimmt in Person und Zahl mit dem Subjekt überein. Das ist ein Vorschlag der automatischen Grammatikvorbereitung.')
  # If the predicate starts with a reflexive se, link se to the subject.
  clitics=[i for i in idx_verb if words[i]=='se' and i<verbidx]
  if clitics:
   add(idx_subject+clitics,'reflexive','Reflexivpronomen und Subjekt','Hier bezieht sich „se“ wahrscheinlich auf das Subjekt. Bei reflexiven Verben handeln die Personen auf sich selbst bezogen.')
 return groups

QUESTIONS={
 ('coco',1):[{'question':'Wohin möchte Pablo reisen?','choices':['Nach Madrid','Nach Sevilla','Nach Berlin'],'correct':0,'why':'Pablo fährt zu seiner Schwester Clara nach Madrid.'},{'question':'Wo versteckt sich Coco?','choices':['In der Küche','In der Tasche beim Geschenk','Unter dem Sofa'],'correct':1,'why':'Coco sitzt in der großen Tasche beim Geschenk.'}],
 ('coco',2):[{'question':'Warum verpasst Pablo seinen Zug?','choices':['Er schläft ein','Coco sorgt für Chaos am Bahnhof','Sein Ticket ist falsch'],'correct':1,'why':'Wegen Coco muss Pablo sich erst um eine passende Transportbox kümmern.'},{'question':'Wann fährt der nächste Zug?','choices':['Um elf','Um zwölf','Am nächsten Tag'],'correct':0,'why':'Ein weiterer Zug fährt um elf Uhr.'}],
 ('coco',3):[{'question':'Was schenkt Pablo Clara?','choices':['Eine Kamera','Ein Fotoalbum','Ein Paar Schuhe'],'correct':1,'why':'Das Geschenk ist ein Album mit Familienfotos.'},{'question':'Was bringt Coco als eigenes Geschenk?','choices':['Einen roten Socken','Einen Schlüssel','Ein Spielzeug'],'correct':0,'why':'Coco trägt Pablos roten Lieblingssocken mit.'}],
 ('cine',1):[{'question':'Was entdeckt Paula am geschlossenen Kino?','choices':['Ein geheimnisvolles Licht','Eine neue Kinokasse','Eine große Feier'],'correct':0,'why':'Im eigentlich leerstehenden Kino brennt plötzlich Licht.'},{'question':'Wann soll die mysteriöse Vorstellung sein?','choices':['Freitag um acht','Samstag um zehn Uhr abends','Sonntag um zwölf'],'correct':1,'why':'Auf dem gelben Ticket steht Samstag, 22 Uhr.'}],
 ('cine',2):[{'question':'Wen treffen Paula und Nico im Kino?','choices':['Einen Polizisten','Inés, die eine Vorführung vorbereitet','Paulas Bruder'],'correct':1,'why':'Inés arbeitet mit einem alten Filmprojektor.'},{'question':'Was erkennt Paula auf dem Film?','choices':['Eine eigene Kindheitsszene','Eine Szene aus Madrid','Ein Bild von Nico im Urlaub'],'correct':0,'why':'Sie entdeckt ihre Großmutter Carmen und sich selbst als Kind.'}],
 ('cine',3):[{'question':'Worüber freut sich Carmen besonders?','choices':['Ein neues Auto','Die alte Filmaufnahme mit Paula','Ein Geburtstagsgeschenk'],'correct':1,'why':'Sie sieht sich selbst mit der kleinen Paula in der alten Aufnahme.'},{'question':'Ist die Zukunft des Cine Luna am Ende bereits sicher?','choices':['Ja, ein Vertrag ist unterschrieben','Nein, es gibt nur Hoffnung auf einen neuen Plan','Nein, das Kino wurde schon abgerissen'],'correct':1,'why':'Eine neue Nutzung wird geprüft, doch die endgültige Entscheidung steht noch aus.'}]
}
SENTENCE_DE={}
for line in (B/'story_tools/sentence_translations.tsv').read_text().splitlines():
 if '||' in line:
  es,de=line.split('||',1);SENTENCE_DE[es.strip()]=de.strip()
INFO=[('coco','El gato que quiere viajar','Humor & Alltag','Ein aufgeweckter Kater schmuggelt sich auf eine Reise nach Madrid.','A1','A2', ['La maleta azul','¡Un gato en la estación!','El regalo de Clara']),('cine','La última función del Cine Luna','Mystery & Freundschaft','Ein verlassenes Kino, ein geheimnisvolles Licht und eine Erinnerung, die zurückkehrt.','A2','B1',['Una luz en la oscuridad','La mujer del proyector','La última función'])]
# Titles for versions: keep prose untouched, B1 has its own titles.
ALT_TITLES={'coco_A2':['Un pasajero secreto','El gato que perdió un tren','La foto perfecta'],'cine_B1':['El edificio que no estaba vacío','Los secretos de la sala oscura','Cuando se encienden las luces']}
CATALOG={'format':'palabra-story-v1','formatVersion':2,'stories':[]}
METRICS=[]
for prefix,title,genre,description,*rest in INFO:
 levels=rest[:2]; chaptertitles=rest[2]
 for level in levels:
  edition={'id':f'{prefix}-{level.lower()}','workId':prefix,'title':title,'genre':genre,'level':level,'subtitle':genre,'description':description,'chapters':[]}
  wordcount=0
  for ci in range(1,4):
   text=(T/f'{prefix}_{level}_{ci}.txt').read_text().strip()
   # editorially agreed very small correction
   text=text.replace('Su hermana Clara tiene cumpleaños.', 'Es el cumpleaños de su hermana Clara.')
   paragraphs=[x.strip() for x in re.split(r'\n\s*\n',text) if x.strip()]
   # Remove narrative heading and ending FIN if present
   ch={'id':f'ch-{ci}', 'title':ALT_TITLES.get(f'{prefix}_{level}',chaptertitles)[ci-1], 'questions':QUESTIONS.get((prefix,ci),[]), 'sentences':[]}
   count=0
   for pi,paragraph in enumerate(paragraphs):
    sentences=[]
    for line in paragraph.splitlines():
     sentences.extend(split_line(line.strip()))
    for si,es in enumerate(sentences):
     if es=='FIN.':continue
     count+=1
     sid=f'{edition["id"]}-c{ci}-s{count}'
     tokens=[];last=0
     for wi,m in enumerate(WORD.finditer(es),1):
      surface=m.group();word=surface.casefold(); info=enrich(surface)
      tid=f'{sid}-w{wi}'
      entry={'id':tid,'text':surface,'before':es[last:m.start()],**info}
      linked=VREF.get(info['lemma'].casefold(),[])
      if len(linked)==1:entry['vocabId']=linked[0]['id']
      tokens.append(entry);last=m.end()
     trailing=es[last:]
     if not tokens:continue
     synt=[]
     for gi,(role,start,end) in enumerate(chunks(tokens),1):
      synt.append({'id':f'{sid}-x{gi}','role':role,'members':[t['id'] for t in tokens[start:end]],'label':'','why':''})
     # For this edition we intentionally do not invent a prose translation:
     # only genuinely checked sentence translations are presented as natural German.
     ch['sentences'].append({'id':sid,'es':es,'de':SENTENCE_DE.get(es,''),'literal':'','tokens':tokens,'trailing':trailing,'groups':relationships(tokens,synt), 'syntax':synt,'paragraphStart':si==0})
   wordcount+=sum(len(s['tokens']) for s in ch['sentences'])
   edition['chapters'].append(ch)
  CATALOG['stories'].append(edition)
  METRICS.append((edition['id'],wordcount,sum(len(c['sentences']) for c in edition['chapters'])))
(B/'stories/catalog.json').write_text(json.dumps(CATALOG,ensure_ascii=False,indent=2)+'\n')
(B/'stories/catalog.js').write_text('/* Produced from catalog.json by Palabra authoring tools. */\nwindow.PALABRA_STORY_CATALOG = '+json.dumps(CATALOG,ensure_ascii=False,separators=(',',':'))+';\n')
missing=collections.Counter(t['text'].casefold() for s in CATALOG['stories'] for c in s['chapters'] for sen in c['sentences'] for t in sen['tokens'] if t['de']=='Noch nicht lexikalisch geprüft')
(B/'story_tools/UNKNOWN_WORDS_REVIEW.tsv').write_text('Spanisch\tVorkommen\n'+'\n'.join(f'{w}\t{n}' for w,n in missing.most_common())+'\n')
print('STORY METRICS',METRICS)
print('TOTAL words',sum(x[1] for x in METRICS),'sentences',sum(x[2] for x in METRICS),'unique unresolved',len(missing),'unresolved occurrences',sum(missing.values()))
print('MISSING TOP',missing.most_common(100))
