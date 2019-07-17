# Mela-Backend created with Express

To install and use this project:
* Clone repo
* Npm install
* Npm start

This is not a standalone backend but connected to the [Mela Frontend](https://github.com/daBack/Mela-Backend) which can be found on my [Git](https://github.com/daBack/).

# Krav 1
Denna backend är skapad i Express.
För att göra det enkelt för mig så har jag delat upp filerna i routes och modules. Routerna hanterar endast vilka routes som API:t kan anslutas mot. Sedan sker själva funktionaliteten i modul mappen där filerna är kopplade till respektive route.

Jag vet hur ett API fungerar men jag har aldrig gjort routes själv tidigare. Det resulterade i att de inte följer rätt standard gällande API metoder. Jag har försökt att skapa Delete metoder för delete funktioner samt POST och UPDATE vid rätt tillfällen, men jag tror att alla inte riktigt är helt korrekt. Vid nästa skapande av API så ska jag se till att skapa alla routes redan innan så jag bygger upp en bra struktion. Då blir det inte påbyggt och svår underhållt.

Jag använde mig hela tiden utav Postman för att testa de routes jag skapade. Det är ett otroligt bra verktyg där man inte behöver en frontend för att testa funktionaliteten. 

Databasen är skapad i sqlite. Databas är något jag tidigare inte velat jobba med eller tyckt om. När jag däremot satte mig in i det så var det som en ljus dörr som öppnade sig i mörkret.. fast bara på glänt. Det tog tid att lära sig JOIN och databas tänket men nu tror jag det sitter bättre än innan och det kommer jag ta med mig till nästkommande projekt.

# Krav 3
Realtidsaspekten skapade jag med hjälp av socket.IO. Jag fick syn på det i Emils video på Dbwebbs youtubekanal. Det kändes som lite enklare API än websockets och efter att ha skummat igenom socket.io´s hemsida så blev det valet. Realtids aspekten är implementerat på så vis att när en användare anländer till home routen (där man kan köpa produkter) så ansluter sig frontend till backends websocket. Var 5 sekund kör backend en funktion som hämtar priser och produkter från produkttabellen som den sedan skickar via en socket anslutning till frontend.

Det finns tyvärr ingen endpoint för att enkelt byta pris på en vara. För att då kunna ändra priset får man gå in i users.sqlite och köra en query för att manuellt uppdatera priset. Jag valde att göra såhär då det inte var något krav att man enkelt skulle kunna byta pris, utan att alternativet bara skulle finnas, samt att information skulle skickas i realtid.

Jag tycker realtid är otroligt roligt att jobba med, då det skapar en till nivå av interaktion på sidan. Ju mer levande desto bättre. Det krånglade lite med on.message funktionerna tillsammans med React och Hooks vilket skapade många oändliga loopar samt duplicerande av calls till funktionen. Det löste sig i slutändan när jag fick lite bättre koll på Hooks.