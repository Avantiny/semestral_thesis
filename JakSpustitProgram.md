# Jak spustit aplikaci

Pro spuštění programu je potřeba nainstalovat editor kódu.
Práce byla psána pomocí Visual Studio Code.
Tento program je dostupný z: https://code.visualstudio.com/

## Stažení programů

Pro spuštění programu jsou vyžadovány programy Node.js a MariaDB.
Tyto programy lze získat z:
https://nodejs.org/en/ (pro práci byla využita verze 12.13.1 )
https://downloads.mariadb.org/. (pro práci byla využita verze 10.4.8)

## Instalace Node.js

Jednoduše se proklikejte intalačním souborem, není potřeba nic zadávat ani měnit.

## Instalace MariaDB

Ze stránky stáhněte MariaDB jako MSI package.
Pokud nebude jinak řečeno v následujícím textu, neměňte výchozí natavení.

Při instalaci MariaDB je nutné zadat "New root password"
Zvolte heslo dle vašeho uvážení a zapamatujte/zapište si jej.

V následujícím okně vyplňte:
Service Name: MariaDB
TCP port: 3306

## Databáze

Pro spuštění back-endu je prvně nutné vytvořit databázi pro nahrávání dat.

Je to možné udělat vícero způsoby:

## 1) Přes klienta příkazové řádky MySQL Client (Doporučeno)

Tento program se nainstaluje zároveň s MariaDB.

Při jeho spuštění zadejte heslo z instalace programu MariaDB a klikněte na klávesu "Enter"

Zadejte příkaz CREATE DATABASE "vámi zvolené jméno"; (bez uvozovek, středník na konci nevynechejte) a klikněte na klávesu "Enter"

## 2) přes grafického klienta

K tomuto účelu lze využít jakýkoliv program, co funguje jako grafický klient pro MariaDB.

Pro klienta HeidiSQL, dostupného z https://www.heidisql.com/download.php je postup následující:

Nainstalujte a spusťe program. V záložce "Správce míst" kliněte na "Nové" a vyplňte údaje následovně:

Druh sítě: MariaDB or MySQL (TCP/IP)
Library: libmariadb.dll
Hostitel/IP: 127.0.0.1
Uživatel: root
Heslo: (Napište heslo z instalace MariaDB)
Port: (Doporučuji výchozí port 3306)
Databáze: (nastavte podle sebe)

Klikněte na otevřít.

## Spuštění front-endu

Otevřete složku "Front-end" pomocí editoru kódu (File->Open Folder).
Zobrazte konzoli (Pro Visual Studio Code: Terminal->New Terminal).
Do konzole zadejte příkaz "npm i" (bez uvozovek) a stiskněte tlačítko "Enter", čímž nainstalujete externí knihovny.
Vyčkejte, než se tyto knihovny stáhnou.
Zadejte příkaz "npm start" (bez uvozovek) a stiskněte tlačítko "Enter", čímž spustíte front-end.
Vyčkejte, než se program sám spustí ve vašem prohlížeči.
Zobrazí se pouze kostra programu nenaplněná daty ze serveru.
Pokud se program nespustí, zadejte do adresy prohlížeče http://localhost:3000/

## Spuštění back-endu

V novém okně editoru kódu (front-end nevypínejte) otevřete složku "Back-end".
Ve Visual Studio Code otevřete nové okno přes File->New Window
Nejprve je nutné nastavit v souboru "env-config.ts" údaje pro přístup do databáze.
V programu Visual Studio Code je seznam souborů zobrazen n levé straně.
Smažte znaky x ze souboru a doplňte vlastní údaje.

const config = {
DB_HOST: 'xxxxxxxxx',
DB_USER: 'xxxxxxxxx',
DB_PASSWORD: 'xxxxxxxxx',
DB_DATABASE: 'xxxxxxxxx',
DB_PORT: xxxx,
}

export default config

Ve výsledné podobě by měl vypadat soubor např. takto:

const config = {
DB_HOST: '127.0.0.1',
DB_USER: 'root',
DB_PASSWORD: '12341234',
DB_DATABASE: 'semestralniprace_db',
DB_PORT: 3306,
}

export default config

Zobrazte konzoli, a do ní zadejte příkaz "npm i" (bez uvozovek) a stiskněte tlačítko "Enter", čímž nainstalujete externí knihovny.
Vyčkejte, než se tyto knihovny stáhnou.
Zadejte příkaz "npm run db:load-data" a vyčkejte, než se objeví hláška "done!!!"
Toto může trvat i několik minut.
Pokud se zobrazí error, zkuste do konzole napsat příkaz "npm i ts-node-dev"

Poté, co proces nahrávání údajů do databáze proběhne zadejte příkaz "npm start" a stiskněte tlačítko enter

V prohlížeči by se nyní měla zobrazit plně funkční aplikace.
