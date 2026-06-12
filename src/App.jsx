import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ============================================================
   POKÉ GAUNTLET — Can you go 13-0?
   Draft 6. Beat 8 Gyms, the Elite Four, and the Champion.
   ============================================================ */

const DEX_RAW = "Bulbasaur~bulbasaur|11|3|1|0|45|49|49|65|65|45;Ivysaur~ivysaur|11|3|1|0|60|62|63|80|80|60;Venusaur~venusaur|11|3|1|0|80|82|83|100|100|80;Charmander~charmander|9|-1|1|0|39|52|43|60|50|65;Charmeleon~charmeleon|9|-1|1|0|58|64|58|80|65|80;Charizard~charizard|9|2|1|0|78|84|78|109|85|100;Squirtle~squirtle|10|-1|1|0|44|48|65|50|64|43;Wartortle~wartortle|10|-1|1|0|59|63|80|65|80|58;Blastoise~blastoise|10|-1|1|0|79|83|100|85|105|78;Caterpie~caterpie|6|-1|1|0|45|30|35|20|20|45;Metapod~metapod|6|-1|1|0|50|20|55|25|25|30;Butterfree~butterfree|6|2|1|0|60|45|50|90|80|70;Weedle~weedle|6|3|1|0|40|35|30|20|20|50;Kakuna~kakuna|6|3|1|0|45|25|50|25|25|35;Beedrill~beedrill|6|3|1|0|65|90|40|45|80|75;Pidgey~pidgey|0|2|1|0|40|45|40|35|35|56;Pidgeotto~pidgeotto|0|2|1|0|63|60|55|50|50|71;Pidgeot~pidgeot|0|2|1|0|83|80|75|70|70|101;Rattata~rattata|0|-1|1|0|30|56|35|25|35|72;Raticate~raticate|0|-1|1|0|55|81|60|50|70|97;Spearow~spearow|0|2|1|0|40|60|30|31|31|70;Fearow~fearow|0|2|1|0|65|90|65|61|61|100;Ekans~ekans|3|-1|1|0|35|60|44|40|54|55;Arbok~arbok|3|-1|1|0|60|95|69|65|79|80;Pikachu~pikachu|12|-1|1|0|35|55|40|50|50|90;Raichu~raichu|12|-1|1|0|60|90|55|90|80|110;Sandshrew~sandshrew|4|-1|1|0|50|75|85|20|30|40;Sandslash~sandslash|4|-1|1|0|75|100|110|45|55|65;Nidoran♀~nidoran-f|3|-1|1|0|55|47|52|40|40|41;Nidorina~nidorina|3|-1|1|0|70|62|67|55|55|56;Nidoqueen~nidoqueen|3|4|1|0|90|92|87|75|85|76;Nidoran♂~nidoran-m|3|-1|1|0|46|57|40|40|40|50;Nidorino~nidorino|3|-1|1|0|61|72|57|55|55|65;Nidoking~nidoking|3|4|1|0|81|102|77|85|75|85;Clefairy~clefairy|17|-1|1|0|70|45|48|60|65|35;Clefable~clefable|17|-1|1|0|95|70|73|95|90|60;Vulpix~vulpix|9|-1|1|0|38|41|40|50|65|65;Ninetales~ninetales|9|-1|1|0|73|76|75|81|100|100;Jigglypuff~jigglypuff|0|17|1|0|115|45|20|45|25|20;Wigglytuff~wigglytuff|0|17|1|0|140|70|45|85|50|45;Zubat~zubat|3|2|1|0|40|45|35|30|40|55;Golbat~golbat|3|2|1|0|75|80|70|65|75|90;Oddish~oddish|11|3|1|0|45|50|55|75|65|30;Gloom~gloom|11|3|1|0|60|65|70|85|75|40;Vileplume~vileplume|11|3|1|0|75|80|85|110|90|50;Paras~paras|6|11|1|0|35|70|55|45|55|25;Parasect~parasect|6|11|1|0|60|95|80|60|80|30;Venonat~venonat|6|3|1|0|60|55|50|40|55|45;Venomoth~venomoth|6|3|1|0|70|65|60|90|75|90;Diglett~diglett|4|-1|1|0|10|55|25|35|45|95;Dugtrio~dugtrio|4|-1|1|0|35|100|50|50|70|120;Meowth~meowth|0|-1|1|0|40|45|35|40|40|90;Persian~persian|0|-1|1|0|65|70|60|65|65|115;Psyduck~psyduck|10|-1|1|0|50|52|48|65|50|55;Golduck~golduck|10|-1|1|0|80|82|78|95|80|85;Mankey~mankey|1|-1|1|0|40|80|35|35|45|70;Primeape~primeape|1|-1|1|0|65|105|60|60|70|95;Growlithe~growlithe|9|-1|1|0|55|70|45|70|50|60;Arcanine~arcanine|9|-1|1|0|90|110|80|100|80|95;Poliwag~poliwag|10|-1|1|0|40|50|40|40|40|90;Poliwhirl~poliwhirl|10|-1|1|0|65|65|65|50|50|90;Poliwrath~poliwrath|10|1|1|0|90|95|95|70|90|70;Abra~abra|13|-1|1|0|25|20|15|105|55|90;Kadabra~kadabra|13|-1|1|0|40|35|30|120|70|105;Alakazam~alakazam|13|-1|1|0|55|50|45|135|95|120;Machop~machop|1|-1|1|0|70|80|50|35|35|35;Machoke~machoke|1|-1|1|0|80|100|70|50|60|45;Machamp~machamp|1|-1|1|0|90|130|80|65|85|55;Bellsprout~bellsprout|11|3|1|0|50|75|35|70|30|40;Weepinbell~weepinbell|11|3|1|0|65|90|50|85|45|55;Victreebel~victreebel|11|3|1|0|80|105|65|100|70|70;Tentacool~tentacool|10|3|1|0|40|40|35|50|100|70;Tentacruel~tentacruel|10|3|1|0|80|70|65|80|120|100;Geodude~geodude|5|4|1|0|40|80|100|30|30|20;Graveler~graveler|5|4|1|0|55|95|115|45|45|35;Golem~golem|5|4|1|0|80|120|130|55|65|45;Ponyta~ponyta|9|-1|1|0|50|85|55|65|65|90;Rapidash~rapidash|9|-1|1|0|65|100|70|80|80|105;Slowpoke~slowpoke|10|13|1|0|90|65|65|40|40|15;Slowbro~slowbro|10|13|1|0|95|75|110|100|80|30;Magnemite~magnemite|12|8|1|0|25|35|70|95|55|45;Magneton~magneton|12|8|1|0|50|60|95|120|70|70;Farfetch'd~farfetchd|0|2|1|0|52|90|55|58|62|60;Doduo~doduo|0|2|1|0|35|85|45|35|35|75;Dodrio~dodrio|0|2|1|0|60|110|70|60|60|110;Seel~seel|10|-1|1|0|65|45|55|45|70|45;Dewgong~dewgong|10|14|1|0|90|70|80|70|95|70;Grimer~grimer|3|-1|1|0|80|80|50|40|50|25;Muk~muk|3|-1|1|0|105|105|75|65|100|50;Shellder~shellder|10|-1|1|0|30|65|100|45|25|40;Cloyster~cloyster|10|14|1|0|50|95|180|85|45|70;Gastly~gastly|7|3|1|0|30|35|30|100|35|80;Haunter~haunter|7|3|1|0|45|50|45|115|55|95;Gengar~gengar|7|3|1|0|60|65|60|130|75|110;Onix~onix|5|4|1|0|35|45|160|30|45|70;Drowzee~drowzee|13|-1|1|0|60|48|45|43|90|42;Hypno~hypno|13|-1|1|0|85|73|70|73|115|67;Krabby~krabby|10|-1|1|0|30|105|90|25|25|50;Kingler~kingler|10|-1|1|0|55|130|115|50|50|75;Voltorb~voltorb|12|-1|1|0|40|30|50|55|55|100;Electrode~electrode|12|-1|1|0|60|50|70|80|80|150;Exeggcute~exeggcute|11|13|1|0|60|40|80|60|45|40;Exeggutor~exeggutor|11|13|1|0|95|95|85|125|75|55;Cubone~cubone|4|-1|1|0|50|50|95|40|50|35;Marowak~marowak|4|-1|1|0|60|80|110|50|80|45;Hitmonlee~hitmonlee|1|-1|1|0|50|120|53|35|110|87;Hitmonchan~hitmonchan|1|-1|1|0|50|105|79|35|110|76;Lickitung~lickitung|0|-1|1|0|90|55|75|60|75|30;Koffing~koffing|3|-1|1|0|40|65|95|60|45|35;Weezing~weezing|3|-1|1|0|65|90|120|85|70|60;Rhyhorn~rhyhorn|4|5|1|0|80|85|95|30|30|25;Rhydon~rhydon|4|5|1|0|105|130|120|45|45|40;Chansey~chansey|0|-1|1|0|250|5|5|35|105|50;Tangela~tangela|11|-1|1|0|65|55|115|100|40|60;Kangaskhan~kangaskhan|0|-1|1|0|105|95|80|40|80|90;Horsea~horsea|10|-1|1|0|30|40|70|70|25|60;Seadra~seadra|10|-1|1|0|55|65|95|95|45|85;Goldeen~goldeen|10|-1|1|0|45|67|60|35|50|63;Seaking~seaking|10|-1|1|0|80|92|65|65|80|68;Staryu~staryu|10|-1|1|0|30|45|55|70|55|85;Starmie~starmie|10|13|1|0|60|75|85|100|85|115;Mr. Mime~mr-mime|13|17|1|0|40|45|65|100|120|90;Scyther~scyther|6|2|1|0|70|110|80|55|80|105;Jynx~jynx|14|13|1|0|65|50|35|115|95|95;Electabuzz~electabuzz|12|-1|1|0|65|83|57|95|85|105;Magmar~magmar|9|-1|1|0|65|95|57|100|85|93;Pinsir~pinsir|6|-1|1|0|65|125|100|55|70|85;Tauros~tauros|0|-1|1|0|75|100|95|40|70|110;Magikarp~magikarp|10|-1|1|0|20|10|55|15|20|80;Gyarados~gyarados|10|2|1|0|95|125|79|60|100|81;Lapras~lapras|10|14|1|0|130|85|80|85|95|60;Ditto~ditto|0|-1|1|0|48|48|48|48|48|48;Eevee~eevee|0|-1|1|0|55|55|50|45|65|55;Vaporeon~vaporeon|10|-1|1|0|130|65|60|110|95|65;Jolteon~jolteon|12|-1|1|0|65|65|60|110|95|130;Flareon~flareon|9|-1|1|0|65|130|60|95|110|65;Porygon~porygon|0|-1|1|0|65|60|70|85|75|40;Omanyte~omanyte|5|10|1|0|35|40|100|90|55|35;Omastar~omastar|5|10|1|0|70|60|125|115|70|55;Kabuto~kabuto|5|10|1|0|30|80|90|55|45|55;Kabutops~kabutops|5|10|1|0|60|115|105|65|70|80;Aerodactyl~aerodactyl|5|2|1|0|80|105|65|60|75|130;Snorlax~snorlax|0|-1|1|0|160|110|65|65|110|30;Articuno~articuno|14|2|1|1|90|85|100|95|125|85;Zapdos~zapdos|12|2|1|1|90|90|85|125|90|100;Moltres~moltres|9|2|1|1|90|100|90|125|85|90;Dratini~dratini|15|-1|1|0|41|64|45|50|50|50;Dragonair~dragonair|15|-1|1|0|61|84|65|70|70|70;Dragonite~dragonite|15|2|1|0|91|134|95|100|100|80;Mewtwo~mewtwo|13|-1|1|1|106|110|90|154|90|130;Mew~mew|13|-1|1|1|100|100|100|100|100|100;Chikorita~chikorita|11|-1|2|0|45|49|65|49|65|45;Bayleef~bayleef|11|-1|2|0|60|62|80|63|80|60;Meganium~meganium|11|-1|2|0|80|82|100|83|100|80;Cyndaquil~cyndaquil|9|-1|2|0|39|52|43|60|50|65;Quilava~quilava|9|-1|2|0|58|64|58|80|65|80;Typhlosion~typhlosion|9|-1|2|0|78|84|78|109|85|100;Totodile~totodile|10|-1|2|0|50|65|64|44|48|43;Croconaw~croconaw|10|-1|2|0|65|80|80|59|63|58;Feraligatr~feraligatr|10|-1|2|0|85|105|100|79|83|78;Sentret~sentret|0|-1|2|0|35|46|34|35|45|20;Furret~furret|0|-1|2|0|85|76|64|45|55|90;Hoothoot~hoothoot|0|2|2|0|60|30|30|36|56|50;Noctowl~noctowl|0|2|2|0|100|50|50|86|96|70;Ledyba~ledyba|6|2|2|0|40|20|30|40|80|55;Ledian~ledian|6|2|2|0|55|35|50|55|110|85;Spinarak~spinarak|6|3|2|0|40|60|40|40|40|30;Ariados~ariados|6|3|2|0|70|90|70|60|70|40;Crobat~crobat|3|2|2|0|85|90|80|70|80|130;Chinchou~chinchou|10|12|2|0|75|38|38|56|56|67;Lanturn~lanturn|10|12|2|0|125|58|58|76|76|67;Pichu~pichu|12|-1|2|0|20|40|15|35|35|60;Cleffa~cleffa|17|-1|2|0|50|25|28|45|55|15;Igglybuff~igglybuff|0|17|2|0|90|30|15|40|20|15;Togepi~togepi|17|-1|2|0|35|20|65|40|65|20;Togetic~togetic|17|2|2|0|55|40|85|80|105|40;Natu~natu|13|2|2|0|40|50|45|70|45|70;Xatu~xatu|13|2|2|0|65|75|70|95|70|95;Mareep~mareep|12|-1|2|0|55|40|40|65|45|35;Flaaffy~flaaffy|12|-1|2|0|70|55|55|80|60|45;Ampharos~ampharos|12|-1|2|0|90|75|85|115|90|55;Bellossom~bellossom|11|-1|2|0|75|80|95|90|100|50;Marill~marill|10|17|2|0|70|20|50|20|50|40;Azumarill~azumarill|10|17|2|0|100|50|80|60|80|50;Sudowoodo~sudowoodo|5|-1|2|0|70|100|115|30|65|30;Politoed~politoed|10|-1|2|0|90|75|75|90|100|70;Hoppip~hoppip|11|2|2|0|35|35|40|35|55|50;Skiploom~skiploom|11|2|2|0|55|45|50|45|65|80;Jumpluff~jumpluff|11|2|2|0|75|55|70|55|95|110;Aipom~aipom|0|-1|2|0|55|70|55|40|55|85;Sunkern~sunkern|11|-1|2|0|30|30|30|30|30|30;Sunflora~sunflora|11|-1|2|0|75|75|55|105|85|30;Yanma~yanma|6|2|2|0|65|65|45|75|45|95;Wooper~wooper|10|4|2|0|55|45|45|25|25|15;Quagsire~quagsire|10|4|2|0|95|85|85|65|65|35;Espeon~espeon|13|-1|2|0|65|65|60|130|95|110;Umbreon~umbreon|16|-1|2|0|95|65|110|60|130|65;Murkrow~murkrow|16|2|2|0|60|85|42|85|42|91;Slowking~slowking|10|13|2|0|95|75|80|100|110|30;Misdreavus~misdreavus|7|-1|2|0|60|60|60|85|85|85;Unown~unown|13|-1|2|0|48|72|48|72|48|48;Wobbuffet~wobbuffet|13|-1|2|0|190|33|58|33|58|33;Girafarig~girafarig|0|13|2|0|70|80|65|90|65|85;Pineco~pineco|6|-1|2|0|50|65|90|35|35|15;Forretress~forretress|6|8|2|0|75|90|140|60|60|40;Dunsparce~dunsparce|0|-1|2|0|100|70|70|65|65|45;Gligar~gligar|4|2|2|0|65|75|105|35|65|85;Steelix~steelix|8|4|2|0|75|85|200|55|65|30;Snubbull~snubbull|17|-1|2|0|60|80|50|40|40|30;Granbull~granbull|17|-1|2|0|90|120|75|60|60|45;Qwilfish~qwilfish|10|3|2|0|65|95|85|55|55|85;Scizor~scizor|6|8|2|0|70|130|100|55|80|65;Shuckle~shuckle|6|5|2|0|20|10|230|10|230|5;Heracross~heracross|6|1|2|0|80|125|75|40|95|85;Sneasel~sneasel|16|14|2|0|55|95|55|35|75|115;Teddiursa~teddiursa|0|-1|2|0|60|80|50|50|50|40;Ursaring~ursaring|0|-1|2|0|90|130|75|75|75|55;Slugma~slugma|9|-1|2|0|40|40|40|70|40|20;Magcargo~magcargo|9|5|2|0|60|50|120|90|80|30;Swinub~swinub|14|4|2|0|50|50|40|30|30|50;Piloswine~piloswine|14|4|2|0|100|100|80|60|60|50;Corsola~corsola|10|5|2|0|65|55|95|65|95|35;Remoraid~remoraid|10|-1|2|0|35|65|35|65|35|65;Octillery~octillery|10|-1|2|0|75|105|75|105|75|45;Delibird~delibird|14|2|2|0|45|55|45|65|45|75;Mantine~mantine|10|2|2|0|85|40|70|80|140|70;Skarmory~skarmory|8|2|2|0|65|80|140|40|70|70;Houndour~houndour|16|9|2|0|45|60|30|80|50|65;Houndoom~houndoom|16|9|2|0|75|90|50|110|80|95;Kingdra~kingdra|10|15|2|0|75|95|95|95|95|85;Phanpy~phanpy|4|-1|2|0|90|60|60|40|40|40;Donphan~donphan|4|-1|2|0|90|120|120|60|60|50;Porygon2~porygon2|0|-1|2|0|85|80|90|105|95|60;Stantler~stantler|0|-1|2|0|73|95|62|85|65|85;Smeargle~smeargle|0|-1|2|0|55|20|35|20|45|75;Tyrogue~tyrogue|1|-1|2|0|35|35|35|35|35|35;Hitmontop~hitmontop|1|-1|2|0|50|95|95|35|110|70;Smoochum~smoochum|14|13|2|0|45|30|15|85|65|65;Elekid~elekid|12|-1|2|0|45|63|37|65|55|95;Magby~magby|9|-1|2|0|45|75|37|70|55|83;Miltank~miltank|0|-1|2|0|95|80|105|40|70|100;Blissey~blissey|0|-1|2|0|255|10|10|75|135|55;Raikou~raikou|12|-1|2|1|90|85|75|115|100|115;Entei~entei|9|-1|2|1|115|115|85|90|75|100;Suicune~suicune|10|-1|2|1|100|75|115|90|115|85;Larvitar~larvitar|5|4|2|0|50|64|50|45|50|41;Pupitar~pupitar|5|4|2|0|70|84|70|65|70|51;Tyranitar~tyranitar|5|16|2|0|100|134|110|95|100|61;Lugia~lugia|13|2|2|1|106|90|130|90|154|110;Ho-Oh~ho-oh|9|2|2|1|106|130|90|110|154|90;Celebi~celebi|13|11|2|1|100|100|100|100|100|100;Treecko~treecko|11|-1|3|0|40|45|35|65|55|70;Grovyle~grovyle|11|-1|3|0|50|65|45|85|65|95;Sceptile~sceptile|11|-1|3|0|70|85|65|105|85|120;Torchic~torchic|9|-1|3|0|45|60|40|70|50|45;Combusken~combusken|9|1|3|0|60|85|60|85|60|55;Blaziken~blaziken|9|1|3|0|80|120|70|110|70|80;Mudkip~mudkip|10|-1|3|0|50|70|50|50|50|40;Marshtomp~marshtomp|10|4|3|0|70|85|70|60|70|50;Swampert~swampert|10|4|3|0|100|110|90|85|90|60;Poochyena~poochyena|16|-1|3|0|35|55|35|30|30|35;Mightyena~mightyena|16|-1|3|0|70|90|70|60|60|70;Zigzagoon~zigzagoon|0|-1|3|0|38|30|41|30|41|60;Linoone~linoone|0|-1|3|0|78|70|61|50|61|100;Wurmple~wurmple|6|-1|3|0|45|45|35|20|30|20;Silcoon~silcoon|6|-1|3|0|50|35|55|25|25|15;Beautifly~beautifly|6|2|3|0|60|70|50|100|50|65;Cascoon~cascoon|6|-1|3|0|50|35|55|25|25|15;Dustox~dustox|6|3|3|0|60|50|70|50|90|65;Lotad~lotad|10|11|3|0|40|30|30|40|50|30;Lombre~lombre|10|11|3|0|60|50|50|60|70|50;Ludicolo~ludicolo|10|11|3|0|80|70|70|90|100|70;Seedot~seedot|11|-1|3|0|40|40|50|30|30|30;Nuzleaf~nuzleaf|11|16|3|0|70|70|40|60|40|60;Shiftry~shiftry|11|16|3|0|90|100|60|90|60|80;Taillow~taillow|0|2|3|0|40|55|30|30|30|85;Swellow~swellow|0|2|3|0|60|85|60|75|50|125;Wingull~wingull|10|2|3|0|40|30|30|55|30|85;Pelipper~pelipper|10|2|3|0|60|50|100|95|70|65;Ralts~ralts|13|17|3|0|28|25|25|45|35|40;Kirlia~kirlia|13|17|3|0|38|35|35|65|55|50;Gardevoir~gardevoir|13|17|3|0|68|65|65|125|115|80;Surskit~surskit|6|10|3|0|40|30|32|50|52|65;Masquerain~masquerain|6|2|3|0|70|60|62|100|82|80;Shroomish~shroomish|11|-1|3|0|60|40|60|40|60|35;Breloom~breloom|11|1|3|0|60|130|80|60|60|70;Slakoth~slakoth|0|-1|3|0|60|60|60|35|35|30;Vigoroth~vigoroth|0|-1|3|0|80|80|80|55|55|90;Slaking~slaking|0|-1|3|0|150|160|100|95|65|100;Nincada~nincada|6|4|3|0|31|45|90|30|30|40;Ninjask~ninjask|6|2|3|0|61|90|45|50|50|160;Shedinja~shedinja|6|7|3|0|1|90|45|30|30|40;Whismur~whismur|0|-1|3|0|64|51|23|51|23|28;Loudred~loudred|0|-1|3|0|84|71|43|71|43|48;Exploud~exploud|0|-1|3|0|104|91|63|91|73|68;Makuhita~makuhita|1|-1|3|0|72|60|30|20|30|25;Hariyama~hariyama|1|-1|3|0|144|120|60|40|60|50;Azurill~azurill|0|17|3|0|50|20|40|20|40|20;Nosepass~nosepass|5|-1|3|0|30|45|135|45|90|30;Skitty~skitty|0|-1|3|0|50|45|45|35|35|50;Delcatty~delcatty|0|-1|3|0|70|65|65|55|55|90;Sableye~sableye|16|7|3|0|50|75|75|65|65|50;Mawile~mawile|8|17|3|0|50|85|85|55|55|50;Aron~aron|8|5|3|0|50|70|100|40|40|30;Lairon~lairon|8|5|3|0|60|90|140|50|50|40;Aggron~aggron|8|5|3|0|70|110|180|60|60|50;Meditite~meditite|1|13|3|0|30|40|55|40|55|60;Medicham~medicham|1|13|3|0|60|60|75|60|75|80;Electrike~electrike|12|-1|3|0|40|45|40|65|40|65;Manectric~manectric|12|-1|3|0|70|75|60|105|60|105;Plusle~plusle|12|-1|3|0|60|50|40|85|75|95;Minun~minun|12|-1|3|0|60|40|50|75|85|95;Volbeat~volbeat|6|-1|3|0|65|73|75|47|85|85;Illumise~illumise|6|-1|3|0|65|47|75|73|85|85;Roselia~roselia|11|3|3|0|50|60|45|100|80|65;Gulpin~gulpin|3|-1|3|0|70|43|53|43|53|40;Swalot~swalot|3|-1|3|0|100|73|83|73|83|55;Carvanha~carvanha|10|16|3|0|45|90|20|65|20|65;Sharpedo~sharpedo|10|16|3|0|70|120|40|95|40|95;Wailmer~wailmer|10|-1|3|0|130|70|35|70|35|60;Wailord~wailord|10|-1|3|0|170|90|45|90|45|60;Numel~numel|9|4|3|0|60|60|40|65|45|35;Camerupt~camerupt|9|4|3|0|70|100|70|105|75|40;Torkoal~torkoal|9|-1|3|0|70|85|140|85|70|20;Spoink~spoink|13|-1|3|0|60|25|35|70|80|60;Grumpig~grumpig|13|-1|3|0|80|45|65|90|110|80;Spinda~spinda|0|-1|3|0|60|60|60|60|60|60;Trapinch~trapinch|4|-1|3|0|45|100|45|45|45|10;Vibrava~vibrava|4|15|3|0|50|70|50|50|50|70;Flygon~flygon|4|15|3|0|80|100|80|80|80|100;Cacnea~cacnea|11|-1|3|0|50|85|40|85|40|35;Cacturne~cacturne|11|16|3|0|70|115|60|115|60|55;Swablu~swablu|0|2|3|0|45|40|60|40|75|50;Altaria~altaria|15|2|3|0|75|70|90|70|105|80;Zangoose~zangoose|0|-1|3|0|73|115|60|60|60|90;Seviper~seviper|3|-1|3|0|73|100|60|100|60|65;Lunatone~lunatone|5|13|3|0|90|55|65|95|85|70;Solrock~solrock|5|13|3|0|90|95|85|55|65|70;Barboach~barboach|10|4|3|0|50|48|43|46|41|60;Whiscash~whiscash|10|4|3|0|110|78|73|76|71|60;Corphish~corphish|10|-1|3|0|43|80|65|50|35|35;Crawdaunt~crawdaunt|10|16|3|0|63|120|85|90|55|55;Baltoy~baltoy|4|13|3|0|40|40|55|40|70|55;Claydol~claydol|4|13|3|0|60|70|105|70|120|75;Lileep~lileep|5|11|3|0|66|41|77|61|87|23;Cradily~cradily|5|11|3|0|86|81|97|81|107|43;Anorith~anorith|5|6|3|0|45|95|50|40|50|75;Armaldo~armaldo|5|6|3|0|75|125|100|70|80|45;Feebas~feebas|10|-1|3|0|20|15|20|10|55|80;Milotic~milotic|10|-1|3|0|95|60|79|100|125|81;Castform~castform|0|-1|3|0|70|70|70|70|70|70;Kecleon~kecleon|0|-1|3|0|60|90|70|60|120|40;Shuppet~shuppet|7|-1|3|0|44|75|35|63|33|45;Banette~banette|7|-1|3|0|64|115|65|83|63|65;Duskull~duskull|7|-1|3|0|20|40|90|30|90|25;Dusclops~dusclops|7|-1|3|0|40|70|130|60|130|25;Tropius~tropius|11|2|3|0|99|68|83|72|87|51;Chimecho~chimecho|13|-1|3|0|75|50|80|95|90|65;Absol~absol|16|-1|3|0|65|130|60|75|60|75;Wynaut~wynaut|13|-1|3|0|95|23|48|23|48|23;Snorunt~snorunt|14|-1|3|0|50|50|50|50|50|50;Glalie~glalie|14|-1|3|0|80|80|80|80|80|80;Spheal~spheal|14|10|3|0|70|40|50|55|50|25;Sealeo~sealeo|14|10|3|0|90|60|70|75|70|45;Walrein~walrein|14|10|3|0|110|80|90|95|90|65;Clamperl~clamperl|10|-1|3|0|35|64|85|74|55|32;Huntail~huntail|10|-1|3|0|55|104|105|94|75|52;Gorebyss~gorebyss|10|-1|3|0|55|84|105|114|75|52;Relicanth~relicanth|10|5|3|0|100|90|130|45|65|55;Luvdisc~luvdisc|10|-1|3|0|43|30|55|40|65|97;Bagon~bagon|15|-1|3|0|45|75|60|40|30|50;Shelgon~shelgon|15|-1|3|0|65|95|100|60|50|50;Salamence~salamence|15|2|3|0|95|135|80|110|80|100;Beldum~beldum|8|13|3|0|40|55|80|35|60|30;Metang~metang|8|13|3|0|60|75|100|55|80|50;Metagross~metagross|8|13|3|0|80|135|130|95|90|70;Regirock~regirock|5|-1|3|1|80|100|200|50|100|50;Regice~regice|14|-1|3|1|80|50|100|100|200|50;Registeel~registeel|8|-1|3|1|80|75|150|75|150|50;Latias~latias|15|13|3|1|80|80|90|110|130|110;Latios~latios|15|13|3|1|80|90|80|130|110|110;Kyogre~kyogre|10|-1|3|1|100|100|90|150|140|90;Groudon~groudon|4|-1|3|1|100|150|140|100|90|90;Rayquaza~rayquaza|15|2|3|1|105|150|90|150|90|95;Jirachi~jirachi|8|13|3|1|100|100|100|100|100|100;Deoxys~deoxys|13|-1|3|1|50|150|50|150|50|150;Turtwig~turtwig|11|-1|4|0|55|68|64|45|55|31;Grotle~grotle|11|-1|4|0|75|89|85|55|65|36;Torterra~torterra|11|4|4|0|95|109|105|75|85|56;Chimchar~chimchar|9|-1|4|0|44|58|44|58|44|61;Monferno~monferno|9|1|4|0|64|78|52|78|52|81;Infernape~infernape|9|1|4|0|76|104|71|104|71|108;Piplup~piplup|10|-1|4|0|53|51|53|61|56|40;Prinplup~prinplup|10|-1|4|0|64|66|68|81|76|50;Empoleon~empoleon|10|8|4|0|84|86|88|111|101|60;Starly~starly|0|2|4|0|40|55|30|30|30|60;Staravia~staravia|0|2|4|0|55|75|50|40|40|80;Staraptor~staraptor|0|2|4|0|85|120|70|50|60|100;Bidoof~bidoof|0|-1|4|0|59|45|40|35|40|31;Bibarel~bibarel|0|10|4|0|79|85|60|55|60|71;Kricketot~kricketot|6|-1|4|0|37|25|41|25|41|25;Kricketune~kricketune|6|-1|4|0|77|85|51|55|51|65;Shinx~shinx|12|-1|4|0|45|65|34|40|34|45;Luxio~luxio|12|-1|4|0|60|85|49|60|49|60;Luxray~luxray|12|-1|4|0|80|120|79|95|79|70;Budew~budew|11|3|4|0|40|30|35|50|70|55;Roserade~roserade|11|3|4|0|60|70|65|125|105|90;Cranidos~cranidos|5|-1|4|0|67|125|40|30|30|58;Rampardos~rampardos|5|-1|4|0|97|165|60|65|50|58;Shieldon~shieldon|5|8|4|0|30|42|118|42|88|30;Bastiodon~bastiodon|5|8|4|0|60|52|168|47|138|30;Burmy~burmy|6|-1|4|0|40|29|45|29|45|36;Wormadam~wormadam|6|11|4|0|60|59|85|79|105|36;Mothim~mothim|6|2|4|0|70|94|50|94|50|66;Combee~combee|6|2|4|0|30|30|42|30|42|70;Vespiquen~vespiquen|6|2|4|0|70|80|102|80|102|40;Pachirisu~pachirisu|12|-1|4|0|60|45|70|45|90|95;Buizel~buizel|10|-1|4|0|55|65|35|60|30|85;Floatzel~floatzel|10|-1|4|0|85|105|55|85|50|115;Cherubi~cherubi|11|-1|4|0|45|35|45|62|53|35;Cherrim~cherrim|11|-1|4|0|70|60|70|87|78|85;Shellos~shellos|10|-1|4|0|76|48|48|57|62|34;Gastrodon~gastrodon|10|4|4|0|111|83|68|92|82|39;Ambipom~ambipom|0|-1|4|0|75|100|66|60|66|115;Drifloon~drifloon|7|2|4|0|90|50|34|60|44|70;Drifblim~drifblim|7|2|4|0|150|80|44|90|54|80;Buneary~buneary|0|-1|4|0|55|66|44|44|56|85;Lopunny~lopunny|0|-1|4|0|65|76|84|54|96|105;Mismagius~mismagius|7|-1|4|0|60|60|60|105|105|105;Honchkrow~honchkrow|16|2|4|0|100|125|52|105|52|71;Glameow~glameow|0|-1|4|0|49|55|42|42|37|85;Purugly~purugly|0|-1|4|0|71|82|64|64|59|112;Chingling~chingling|13|-1|4|0|45|30|50|65|50|45;Stunky~stunky|3|16|4|0|63|63|47|41|41|74;Skuntank~skuntank|3|16|4|0|103|93|67|71|61|84;Bronzor~bronzor|8|13|4|0|57|24|86|24|86|23;Bronzong~bronzong|8|13|4|0|67|89|116|79|116|33;Bonsly~bonsly|5|-1|4|0|50|80|95|10|45|10;Mime Jr.~mime-jr|13|17|4|0|20|25|45|70|90|60;Happiny~happiny|0|-1|4|0|100|5|5|15|65|30;Chatot~chatot|0|2|4|0|76|65|45|92|42|91;Spiritomb~spiritomb|7|16|4|0|50|92|108|92|108|35;Gible~gible|15|4|4|0|58|70|45|40|45|42;Gabite~gabite|15|4|4|0|68|90|65|50|55|82;Garchomp~garchomp|15|4|4|0|108|130|95|80|85|102;Munchlax~munchlax|0|-1|4|0|135|85|40|40|85|5;Riolu~riolu|1|-1|4|0|40|70|40|35|40|60;Lucario~lucario|1|8|4|0|70|110|70|115|70|90;Hippopotas~hippopotas|4|-1|4|0|68|72|78|38|42|32;Hippowdon~hippowdon|4|-1|4|0|108|112|118|68|72|47;Skorupi~skorupi|3|6|4|0|40|50|90|30|55|65;Drapion~drapion|3|16|4|0|70|90|110|60|75|95;Croagunk~croagunk|3|1|4|0|48|61|40|61|40|50;Toxicroak~toxicroak|3|1|4|0|83|106|65|86|65|85;Carnivine~carnivine|11|-1|4|0|74|100|72|90|72|46;Finneon~finneon|10|-1|4|0|49|49|56|49|61|66;Lumineon~lumineon|10|-1|4|0|69|69|76|69|86|91;Mantyke~mantyke|10|2|4|0|45|20|50|60|120|50;Snover~snover|11|14|4|0|60|62|50|62|60|40;Abomasnow~abomasnow|11|14|4|0|90|92|75|92|85|60;Weavile~weavile|16|14|4|0|70|120|65|45|85|125;Magnezone~magnezone|12|8|4|0|70|70|115|130|90|60;Lickilicky~lickilicky|0|-1|4|0|110|85|95|80|95|50;Rhyperior~rhyperior|4|5|4|0|115|140|130|55|55|40;Tangrowth~tangrowth|11|-1|4|0|100|100|125|110|50|50;Electivire~electivire|12|-1|4|0|75|123|67|95|85|95;Magmortar~magmortar|9|-1|4|0|75|95|67|125|95|83;Togekiss~togekiss|17|2|4|0|85|50|95|120|115|80;Yanmega~yanmega|6|2|4|0|86|76|86|116|56|95;Leafeon~leafeon|11|-1|4|0|65|110|130|60|65|95;Glaceon~glaceon|14|-1|4|0|65|60|110|130|95|65;Gliscor~gliscor|4|2|4|0|75|95|125|45|75|95;Mamoswine~mamoswine|14|4|4|0|110|130|80|70|60|80;Porygon-Z~porygon-z|0|-1|4|0|85|80|70|135|75|90;Gallade~gallade|13|1|4|0|68|125|65|65|115|80;Probopass~probopass|5|8|4|0|60|55|145|75|150|40;Dusknoir~dusknoir|7|-1|4|0|45|100|135|65|135|45;Froslass~froslass|14|7|4|0|70|80|70|80|70|110;Rotom~rotom|12|7|4|0|50|50|77|95|77|91;Uxie~uxie|13|-1|4|1|75|75|130|75|130|95;Mesprit~mesprit|13|-1|4|1|80|105|105|105|105|80;Azelf~azelf|13|-1|4|1|75|125|70|125|70|115;Dialga~dialga|8|15|4|1|100|120|120|150|100|90;Palkia~palkia|10|15|4|1|90|120|100|150|120|100;Heatran~heatran|9|8|4|1|91|90|106|130|106|77;Regigigas~regigigas|0|-1|4|1|110|160|110|80|110|100;Giratina~giratina|7|15|4|1|150|100|120|100|120|90;Cresselia~cresselia|13|-1|4|1|120|70|110|75|120|85;Phione~phione|10|-1|4|1|80|80|80|80|80|80;Manaphy~manaphy|10|-1|4|1|100|100|100|100|100|100;Darkrai~darkrai|16|-1|4|1|70|90|90|135|90|125;Shaymin~shaymin|11|-1|4|1|100|100|100|100|100|100;Arceus~arceus|0|-1|4|1|120|120|120|120|120|120;Victini~victini|13|9|5|1|100|100|100|100|100|100;Snivy~snivy|11|-1|5|0|45|45|55|45|55|63;Servine~servine|11|-1|5|0|60|60|75|60|75|83;Serperior~serperior|11|-1|5|0|75|75|95|75|95|113;Tepig~tepig|9|-1|5|0|65|63|45|45|45|45;Pignite~pignite|9|1|5|0|90|93|55|70|55|55;Emboar~emboar|9|1|5|0|110|123|65|100|65|65;Oshawott~oshawott|10|-1|5|0|55|55|45|63|45|45;Dewott~dewott|10|-1|5|0|75|75|60|83|60|60;Samurott~samurott|10|-1|5|0|95|100|85|108|70|70;Patrat~patrat|0|-1|5|0|45|55|39|35|39|42;Watchog~watchog|0|-1|5|0|60|85|69|60|69|77;Lillipup~lillipup|0|-1|5|0|45|60|45|25|45|55;Herdier~herdier|0|-1|5|0|65|80|65|35|65|60;Stoutland~stoutland|0|-1|5|0|85|110|90|45|90|80;Purrloin~purrloin|16|-1|5|0|41|50|37|50|37|66;Liepard~liepard|16|-1|5|0|64|88|50|88|50|106;Pansage~pansage|11|-1|5|0|50|53|48|53|48|64;Simisage~simisage|11|-1|5|0|75|98|63|98|63|101;Pansear~pansear|9|-1|5|0|50|53|48|53|48|64;Simisear~simisear|9|-1|5|0|75|98|63|98|63|101;Panpour~panpour|10|-1|5|0|50|53|48|53|48|64;Simipour~simipour|10|-1|5|0|75|98|63|98|63|101;Munna~munna|13|-1|5|0|76|25|45|67|55|24;Musharna~musharna|13|-1|5|0|116|55|85|107|95|29;Pidove~pidove|0|2|5|0|50|55|50|36|30|43;Tranquill~tranquill|0|2|5|0|62|77|62|50|42|65;Unfezant~unfezant|0|2|5|0|80|115|80|65|55|93;Blitzle~blitzle|12|-1|5|0|45|60|32|50|32|76;Zebstrika~zebstrika|12|-1|5|0|75|100|63|80|63|116;Roggenrola~roggenrola|5|-1|5|0|55|75|85|25|25|15;Boldore~boldore|5|-1|5|0|70|105|105|50|40|20;Gigalith~gigalith|5|-1|5|0|85|135|130|60|80|25;Woobat~woobat|13|2|5|0|65|45|43|55|43|72;Swoobat~swoobat|13|2|5|0|67|57|55|77|55|114;Drilbur~drilbur|4|-1|5|0|60|85|40|30|45|68;Excadrill~excadrill|4|8|5|0|110|135|60|50|65|88;Audino~audino|0|-1|5|0|103|60|86|60|86|50;Timburr~timburr|1|-1|5|0|75|80|55|25|35|35;Gurdurr~gurdurr|1|-1|5|0|85|105|85|40|50|40;Conkeldurr~conkeldurr|1|-1|5|0|105|140|95|55|65|45;Tympole~tympole|10|-1|5|0|50|50|40|50|40|64;Palpitoad~palpitoad|10|4|5|0|75|65|55|65|55|69;Seismitoad~seismitoad|10|4|5|0|105|95|75|85|75|74;Throh~throh|1|-1|5|0|120|100|85|30|85|45;Sawk~sawk|1|-1|5|0|75|125|75|30|75|85;Sewaddle~sewaddle|6|11|5|0|45|53|70|40|60|42;Swadloon~swadloon|6|11|5|0|55|63|90|50|80|42;Leavanny~leavanny|6|11|5|0|75|103|80|70|80|92;Venipede~venipede|6|3|5|0|30|45|59|30|39|57;Whirlipede~whirlipede|6|3|5|0|40|55|99|40|79|47;Scolipede~scolipede|6|3|5|0|60|100|89|55|69|112;Cottonee~cottonee|11|17|5|0|40|27|60|37|50|66;Whimsicott~whimsicott|11|17|5|0|60|67|85|77|75|116;Petilil~petilil|11|-1|5|0|45|35|50|70|50|30;Lilligant~lilligant|11|-1|5|0|70|60|75|110|75|90;Basculin~basculin|10|-1|5|0|70|92|65|80|55|98;Sandile~sandile|4|16|5|0|50|72|35|35|35|65;Krokorok~krokorok|4|16|5|0|60|82|45|45|45|74;Krookodile~krookodile|4|16|5|0|95|117|80|65|70|92;Darumaka~darumaka|9|-1|5|0|70|90|45|15|45|50;Darmanitan~darmanitan|9|-1|5|0|105|140|55|30|55|95;Maractus~maractus|11|-1|5|0|75|86|67|106|67|60;Dwebble~dwebble|6|5|5|0|50|65|85|35|35|55;Crustle~crustle|6|5|5|0|70|105|125|65|75|45;Scraggy~scraggy|16|1|5|0|50|75|70|35|70|48;Scrafty~scrafty|16|1|5|0|65|90|115|45|115|58;Sigilyph~sigilyph|13|2|5|0|72|58|80|103|80|97;Yamask~yamask|7|-1|5|0|38|30|85|55|65|30;Cofagrigus~cofagrigus|7|-1|5|0|58|50|145|95|105|30;Tirtouga~tirtouga|10|5|5|0|54|78|103|53|45|22;Carracosta~carracosta|10|5|5|0|74|108|133|83|65|32;Archen~archen|5|2|5|0|55|112|45|74|45|70;Archeops~archeops|5|2|5|0|75|140|65|112|65|110;Trubbish~trubbish|3|-1|5|0|50|50|62|40|62|65;Garbodor~garbodor|3|-1|5|0|80|95|82|60|82|75;Zorua~zorua|16|-1|5|0|40|65|40|80|40|65;Zoroark~zoroark|16|-1|5|0|60|105|60|120|60|105;Minccino~minccino|0|-1|5|0|55|50|40|40|40|75;Cinccino~cinccino|0|-1|5|0|75|95|60|65|60|115;Gothita~gothita|13|-1|5|0|45|30|50|55|65|45;Gothorita~gothorita|13|-1|5|0|60|45|70|75|85|55;Gothitelle~gothitelle|13|-1|5|0|70|55|95|95|110|65;Solosis~solosis|13|-1|5|0|45|30|40|105|50|20;Duosion~duosion|13|-1|5|0|65|40|50|125|60|30;Reuniclus~reuniclus|13|-1|5|0|110|65|75|125|85|30;Ducklett~ducklett|10|2|5|0|62|44|50|44|50|55;Swanna~swanna|10|2|5|0|75|87|63|87|63|98;Vanillite~vanillite|14|-1|5|0|36|50|50|65|60|44;Vanillish~vanillish|14|-1|5|0|51|65|65|80|75|59;Vanilluxe~vanilluxe|14|-1|5|0|71|95|85|110|95|79;Deerling~deerling|0|11|5|0|60|60|50|40|50|75;Sawsbuck~sawsbuck|0|11|5|0|80|100|70|60|70|95;Emolga~emolga|12|2|5|0|55|75|60|75|60|103;Karrablast~karrablast|6|-1|5|0|50|75|45|40|45|60;Escavalier~escavalier|6|8|5|0|70|135|105|60|105|20;Foongus~foongus|11|3|5|0|69|55|45|55|55|15;Amoonguss~amoonguss|11|3|5|0|114|85|70|85|80|30;Frillish~frillish|10|7|5|0|55|40|50|65|85|40;Jellicent~jellicent|10|7|5|0|100|60|70|85|105|60;Alomomola~alomomola|10|-1|5|0|165|75|80|40|45|65;Joltik~joltik|6|12|5|0|50|47|50|57|50|65;Galvantula~galvantula|6|12|5|0|70|77|60|97|60|108;Ferroseed~ferroseed|11|8|5|0|44|50|91|24|86|10;Ferrothorn~ferrothorn|11|8|5|0|74|94|131|54|116|20;Klink~klink|8|-1|5|0|40|55|70|45|60|30;Klang~klang|8|-1|5|0|60|80|95|70|85|50;Klinklang~klinklang|8|-1|5|0|60|100|115|70|85|90;Tynamo~tynamo|12|-1|5|0|35|55|40|45|40|60;Eelektrik~eelektrik|12|-1|5|0|65|85|70|75|70|40;Eelektross~eelektross|12|-1|5|0|85|115|80|105|80|50;Elgyem~elgyem|13|-1|5|0|55|55|55|85|55|30;Beheeyem~beheeyem|13|-1|5|0|75|75|75|125|95|40;Litwick~litwick|7|9|5|0|50|30|55|65|55|20;Lampent~lampent|7|9|5|0|60|40|60|95|60|55;Chandelure~chandelure|7|9|5|0|60|55|90|145|90|80;Axew~axew|15|-1|5|0|46|87|60|30|40|57;Fraxure~fraxure|15|-1|5|0|66|117|70|40|50|67;Haxorus~haxorus|15|-1|5|0|76|147|90|60|70|97;Cubchoo~cubchoo|14|-1|5|0|55|70|40|60|40|40;Beartic~beartic|14|-1|5|0|95|130|80|70|80|50;Cryogonal~cryogonal|14|-1|5|0|80|50|50|95|135|105;Shelmet~shelmet|6|-1|5|0|50|40|85|40|65|25;Accelgor~accelgor|6|-1|5|0|80|70|40|100|60|145;Stunfisk~stunfisk|4|12|5|0|109|66|84|81|99|32;Mienfoo~mienfoo|1|-1|5|0|45|85|50|55|50|65;Mienshao~mienshao|1|-1|5|0|65|125|60|95|60|105;Druddigon~druddigon|15|-1|5|0|77|120|90|60|90|48;Golett~golett|4|7|5|0|59|74|50|35|50|35;Golurk~golurk|4|7|5|0|89|124|80|55|80|55;Pawniard~pawniard|16|8|5|0|45|85|70|40|40|60;Bisharp~bisharp|16|8|5|0|65|125|100|60|70|70;Bouffalant~bouffalant|0|-1|5|0|95|110|95|40|95|55;Rufflet~rufflet|0|2|5|0|70|83|50|37|50|60;Braviary~braviary|0|2|5|0|100|123|75|57|75|80;Vullaby~vullaby|16|2|5|0|70|55|75|45|65|60;Mandibuzz~mandibuzz|16|2|5|0|110|65|105|55|95|80;Heatmor~heatmor|9|-1|5|0|85|97|66|105|66|65;Durant~durant|6|8|5|0|58|109|112|48|48|109;Deino~deino|16|15|5|0|52|65|50|45|50|38;Zweilous~zweilous|16|15|5|0|72|85|70|65|70|58;Hydreigon~hydreigon|16|15|5|0|92|105|90|125|90|98;Larvesta~larvesta|6|9|5|0|55|85|55|50|55|60;Volcarona~volcarona|6|9|5|0|85|60|65|135|105|100;Cobalion~cobalion|8|1|5|1|91|90|129|90|72|108;Terrakion~terrakion|5|1|5|1|91|129|90|72|90|108;Virizion~virizion|11|1|5|1|91|90|72|90|129|108;Tornadus~tornadus|2|-1|5|1|79|115|70|125|80|111;Thundurus~thundurus|12|2|5|1|79|115|70|125|80|111;Reshiram~reshiram|15|9|5|1|100|120|100|150|120|90;Zekrom~zekrom|15|12|5|1|100|150|120|120|100|90;Landorus~landorus|4|2|5|1|89|125|90|115|80|101;Kyurem~kyurem|15|14|5|1|125|130|90|130|90|95;Keldeo~keldeo|10|1|5|1|91|72|90|129|90|108;Meloetta~meloetta|0|13|5|1|100|77|77|128|128|90;Genesect~genesect|6|8|5|1|71|120|95|120|95|99;Chespin~chespin|11|-1|6|0|56|61|65|48|45|38;Quilladin~quilladin|11|-1|6|0|61|78|95|56|58|57;Chesnaught~chesnaught|11|1|6|0|88|107|122|74|75|64;Fennekin~fennekin|9|-1|6|0|40|45|40|62|60|60;Braixen~braixen|9|-1|6|0|59|59|58|90|70|73;Delphox~delphox|9|13|6|0|75|69|72|114|100|104;Froakie~froakie|10|-1|6|0|41|56|40|62|44|71;Frogadier~frogadier|10|-1|6|0|54|63|52|83|56|97;Greninja~greninja|10|16|6|0|72|95|67|103|71|122;Bunnelby~bunnelby|0|-1|6|0|38|36|38|32|36|57;Diggersby~diggersby|0|4|6|0|85|56|77|50|77|78;Fletchling~fletchling|0|2|6|0|45|50|43|40|38|62;Fletchinder~fletchinder|9|2|6|0|62|73|55|56|52|84;Talonflame~talonflame|9|2|6|0|78|81|71|74|69|126;Scatterbug~scatterbug|6|-1|6|0|38|35|40|27|25|35;Spewpa~spewpa|6|-1|6|0|45|22|60|27|30|29;Vivillon~vivillon|6|2|6|0|80|52|50|90|50|89;Litleo~litleo|9|0|6|0|62|50|58|73|54|72;Pyroar~pyroar|9|0|6|0|86|68|72|109|66|106;Flabebe~flabebe|17|-1|6|0|44|38|39|61|79|42;Floette~floette|17|-1|6|0|54|45|47|75|98|52;Florges~florges|17|-1|6|0|78|65|68|112|154|75;Skiddo~skiddo|11|-1|6|0|66|65|48|62|57|52;Gogoat~gogoat|11|-1|6|0|123|100|62|97|81|68;Pancham~pancham|1|-1|6|0|67|82|62|46|48|43;Pangoro~pangoro|1|16|6|0|95|124|78|69|71|58;Furfrou~furfrou|0|-1|6|0|75|80|60|65|90|102;Espurr~espurr|13|-1|6|0|62|48|54|63|60|68;Meowstic~meowstic|13|-1|6|0|74|48|76|83|81|104;Honedge~honedge|8|7|6|0|45|80|100|35|37|28;Doublade~doublade|8|7|6|0|59|110|150|45|49|35;Aegislash~aegislash|8|7|6|0|60|50|140|50|140|60;Spritzee~spritzee|17|-1|6|0|78|52|60|63|65|23;Aromatisse~aromatisse|17|-1|6|0|101|72|72|99|89|29;Swirlix~swirlix|17|-1|6|0|62|48|66|59|57|49;Slurpuff~slurpuff|17|-1|6|0|82|80|86|85|75|72;Inkay~inkay|16|13|6|0|53|54|53|37|46|45;Malamar~malamar|16|13|6|0|86|92|88|68|75|73;Binacle~binacle|5|10|6|0|42|52|67|39|56|50;Barbaracle~barbaracle|5|10|6|0|72|105|115|54|86|68;Skrelp~skrelp|3|10|6|0|50|60|60|60|60|30;Dragalge~dragalge|3|15|6|0|65|75|90|97|123|44;Clauncher~clauncher|10|-1|6|0|50|53|62|58|63|44;Clawitzer~clawitzer|10|-1|6|0|71|73|88|120|89|59;Helioptile~helioptile|12|0|6|0|44|38|33|61|43|70;Heliolisk~heliolisk|12|0|6|0|62|55|52|109|94|109;Tyrunt~tyrunt|5|15|6|0|58|89|77|45|45|48;Tyrantrum~tyrantrum|5|15|6|0|82|121|119|69|59|71;Amaura~amaura|5|14|6|0|77|59|50|67|63|46;Aurorus~aurorus|5|14|6|0|123|77|72|99|92|58;Sylveon~sylveon|17|-1|6|0|95|65|65|110|130|60;Hawlucha~hawlucha|1|2|6|0|78|92|75|74|63|118;Dedenne~dedenne|12|17|6|0|67|58|57|81|67|101;Carbink~carbink|5|17|6|0|50|50|150|50|150|50;Goomy~goomy|15|-1|6|0|45|50|35|55|75|40;Sliggoo~sliggoo|15|-1|6|0|68|75|53|83|113|60;Goodra~goodra|15|-1|6|0|90|100|70|110|150|80;Klefki~klefki|8|17|6|0|57|80|91|80|87|75;Phantump~phantump|7|11|6|0|43|70|48|50|60|38;Trevenant~trevenant|7|11|6|0|85|110|76|65|82|56;Pumpkaboo~pumpkaboo|7|11|6|0|49|66|70|44|55|51;Gourgeist~gourgeist|7|11|6|0|65|90|122|58|75|84;Bergmite~bergmite|14|-1|6|0|55|69|85|32|35|28;Avalugg~avalugg|14|-1|6|0|95|117|184|44|46|28;Noibat~noibat|2|15|6|0|40|30|35|45|40|55;Noivern~noivern|2|15|6|0|85|70|80|97|80|123;Xerneas~xerneas|17|-1|6|1|126|131|95|131|98|99;Yveltal~yveltal|16|2|6|1|126|131|95|131|98|99;Zygarde~zygarde|15|4|6|1|108|100|121|81|95|95;Diancie~diancie|5|17|6|1|50|100|150|100|150|50;Hoopa~hoopa|13|7|6|1|80|110|60|150|130|70;Volcanion~volcanion|9|10|6|1|80|110|120|130|90|70;Rowlet~rowlet|11|2|7|0|68|55|55|50|50|42;Dartrix~dartrix|11|2|7|0|78|75|75|70|70|52;Decidueye~decidueye|11|7|7|0|78|107|75|100|100|70;Litten~litten|9|-1|7|0|45|65|40|60|40|70;Torracat~torracat|9|-1|7|0|65|85|50|80|50|90;Incineroar~incineroar|9|16|7|0|95|115|90|80|90|60;Popplio~popplio|10|-1|7|0|50|54|54|66|56|40;Brionne~brionne|10|-1|7|0|60|69|69|91|81|50;Primarina~primarina|10|17|7|0|80|74|74|126|116|60;Pikipek~pikipek|0|2|7|0|35|75|30|30|30|65;Trumbeak~trumbeak|0|2|7|0|55|85|50|40|50|75;Toucannon~toucannon|0|2|7|0|80|120|75|75|75|60;Yungoos~yungoos|0|-1|7|0|48|70|30|30|30|45;Gumshoos~gumshoos|0|-1|7|0|88|110|60|55|60|45;Grubbin~grubbin|6|-1|7|0|47|62|45|55|45|46;Charjabug~charjabug|6|12|7|0|57|82|95|55|75|36;Vikavolt~vikavolt|6|12|7|0|77|70|90|145|75|43;Crabrawler~crabrawler|1|-1|7|0|47|82|57|42|47|63;Crabominable~crabominable|1|14|7|0|97|132|77|62|67|43;Oricorio~oricorio|9|2|7|0|75|70|70|98|70|93;Cutiefly~cutiefly|6|17|7|0|40|45|40|55|40|84;Ribombee~ribombee|6|17|7|0|60|55|60|95|70|124;Rockruff~rockruff|5|-1|7|0|45|65|40|30|40|60;Lycanroc~lycanroc|5|-1|7|0|75|115|65|55|65|112;Wishiwashi~wishiwashi|10|-1|7|0|45|20|20|25|25|40;Mareanie~mareanie|3|10|7|0|50|53|62|43|52|45;Toxapex~toxapex|3|10|7|0|50|63|152|53|142|35;Mudbray~mudbray|4|-1|7|0|70|100|70|45|55|45;Mudsdale~mudsdale|4|-1|7|0|100|125|100|55|85|35;Dewpider~dewpider|10|6|7|0|38|40|52|40|72|27;Araquanid~araquanid|10|6|7|0|68|70|92|50|132|42;Fomantis~fomantis|11|-1|7|0|40|55|35|50|35|35;Lurantis~lurantis|11|-1|7|0|70|105|90|80|90|45;Morelull~morelull|11|17|7|0|40|35|55|65|75|15;Shiinotic~shiinotic|11|17|7|0|60|45|80|90|100|30;Salandit~salandit|3|9|7|0|48|44|40|71|40|77;Salazzle~salazzle|3|9|7|0|68|64|60|111|60|117;Stufful~stufful|0|1|7|0|70|75|50|45|50|50;Bewear~bewear|0|1|7|0|120|125|80|55|60|60;Bounsweet~bounsweet|11|-1|7|0|42|30|38|30|38|32;Steenee~steenee|11|-1|7|0|52|40|48|40|48|62;Tsareena~tsareena|11|-1|7|0|72|120|98|50|98|72;Comfey~comfey|17|-1|7|0|51|52|90|82|110|100;Oranguru~oranguru|0|13|7|0|90|60|80|90|110|60;Passimian~passimian|1|-1|7|0|100|120|90|40|60|80;Wimpod~wimpod|6|10|7|0|25|35|40|20|30|80;Golisopod~golisopod|6|10|7|0|75|125|140|60|90|40;Sandygast~sandygast|7|4|7|0|55|55|80|70|45|15;Palossand~palossand|7|4|7|0|85|75|110|100|75|35;Pyukumuku~pyukumuku|10|-1|7|0|55|60|130|30|130|5;Type: Null~type-null|0|-1|7|1|95|95|95|95|95|59;Silvally~silvally|0|-1|7|1|95|95|95|95|95|95;Minior~minior|5|2|7|0|60|60|100|60|100|60;Komala~komala|0|-1|7|0|65|115|65|75|95|65;Turtonator~turtonator|9|15|7|0|60|78|135|91|85|36;Togedemaru~togedemaru|12|8|7|0|65|98|63|40|73|96;Mimikyu~mimikyu|7|17|7|0|55|90|80|50|105|96;Bruxish~bruxish|10|13|7|0|68|105|70|70|70|92;Drampa~drampa|0|15|7|0|78|60|85|135|91|36;Dhelmise~dhelmise|7|11|7|0|70|131|100|86|90|40;Jangmo-o~jangmo-o|15|-1|7|0|45|55|65|45|45|45;Hakamo-o~hakamo-o|15|1|7|0|55|75|90|65|70|65;Kommo-o~kommo-o|15|1|7|0|75|110|125|100|105|85;Tapu Koko~tapu-koko|12|17|7|1|70|115|85|95|75|130;Tapu Lele~tapu-lele|13|17|7|1|70|85|75|130|115|95;Tapu Bulu~tapu-bulu|11|17|7|1|70|130|115|85|95|75;Tapu Fini~tapu-fini|10|17|7|1|70|75|115|95|130|85;Cosmog~cosmog|13|-1|7|1|43|29|31|29|31|37;Cosmoem~cosmoem|13|-1|7|1|43|29|131|29|131|37;Solgaleo~solgaleo|13|8|7|1|137|137|107|113|89|97;Lunala~lunala|13|7|7|1|137|113|89|137|107|97;Nihilego~nihilego|5|3|7|0|109|53|47|127|131|103;Buzzwole~buzzwole|6|1|7|0|107|139|139|53|53|79;Pheromosa~pheromosa|6|1|7|0|71|137|37|137|37|151;Xurkitree~xurkitree|12|-1|7|0|83|89|71|173|71|83;Celesteela~celesteela|8|2|7|0|97|101|103|107|101|61;Kartana~kartana|11|8|7|0|59|181|131|59|31|109;Guzzlord~guzzlord|16|15|7|0|223|101|53|97|53|43;Necrozma~necrozma|13|-1|7|1|97|107|101|127|89|79;Magearna~magearna|8|17|7|1|80|95|115|130|115|65;Marshadow~marshadow|1|7|7|1|90|125|80|90|90|125;Poipole~poipole|3|-1|7|0|67|73|67|73|67|73;Naganadel~naganadel|3|15|7|0|73|73|73|127|73|121;Stakataka~stakataka|5|8|7|0|61|131|211|53|101|13;Blacephalon~blacephalon|9|7|7|0|53|127|53|151|79|107;Zeraora~zeraora|12|-1|7|1|88|112|75|102|80|143;Meltan~meltan|8|-1|7|1|46|65|65|55|35|34;Melmetal~melmetal|8|-1|7|1|135|143|143|80|65|34;Grookey~grookey|11|-1|8|0|50|65|50|40|40|65;Thwackey~thwackey|11|-1|8|0|70|85|70|55|60|80;Rillaboom~rillaboom|11|-1|8|0|100|125|90|60|70|85;Scorbunny~scorbunny|9|-1|8|0|50|71|40|40|40|69;Raboot~raboot|9|-1|8|0|65|86|60|55|60|94;Cinderace~cinderace|9|-1|8|0|80|116|75|65|75|119;Sobble~sobble|10|-1|8|0|50|40|40|70|40|70;Drizzile~drizzile|10|-1|8|0|65|60|55|95|55|90;Inteleon~inteleon|10|-1|8|0|70|85|65|125|65|120;Skwovet~skwovet|0|-1|8|0|70|55|55|35|35|25;Greedent~greedent|0|-1|8|0|120|95|95|55|75|20;Rookidee~rookidee|2|-1|8|0|38|47|35|33|35|57;Corvisquire~corvisquire|2|-1|8|0|68|67|55|43|55|77;Corviknight~corviknight|2|8|8|0|98|87|105|53|85|67;Blipbug~blipbug|6|-1|8|0|25|20|20|25|45|45;Dottler~dottler|6|13|8|0|50|35|80|50|90|30;Orbeetle~orbeetle|6|13|8|0|60|45|110|80|120|90;Nickit~nickit|16|-1|8|0|40|28|28|47|52|50;Thievul~thievul|16|-1|8|0|70|58|58|87|92|90;Gossifleur~gossifleur|11|-1|8|0|40|40|60|40|60|10;Eldegoss~eldegoss|11|-1|8|0|60|50|90|80|120|60;Wooloo~wooloo|0|-1|8|0|42|40|55|40|45|48;Dubwool~dubwool|0|-1|8|0|72|80|100|60|90|88;Chewtle~chewtle|10|-1|8|0|50|64|50|38|38|44;Drednaw~drednaw|10|5|8|0|90|115|90|48|68|74;Yamper~yamper|12|-1|8|0|59|45|50|40|50|26;Boltund~boltund|12|-1|8|0|69|90|60|90|60|121;Rolycoly~rolycoly|5|-1|8|0|30|40|50|40|50|30;Carkol~carkol|5|9|8|0|80|60|90|60|70|50;Coalossal~coalossal|5|9|8|0|110|80|120|80|90|30;Applin~applin|11|15|8|0|40|40|80|40|40|20;Flapple~flapple|11|15|8|0|70|110|80|95|60|70;Appletun~appletun|11|15|8|0|110|85|80|100|80|30;Silicobra~silicobra|4|-1|8|0|52|57|75|35|50|46;Sandaconda~sandaconda|4|-1|8|0|72|107|125|65|70|71;Cramorant~cramorant|2|10|8|0|70|85|55|85|95|85;Arrokuda~arrokuda|10|-1|8|0|41|63|40|40|30|66;Barraskewda~barraskewda|10|-1|8|0|61|123|60|60|50|136;Toxel~toxel|12|3|8|0|40|38|35|54|35|40;Toxtricity~toxtricity|12|3|8|0|75|98|70|114|70|75;Sizzlipede~sizzlipede|9|6|8|0|50|65|45|50|50|45;Centiskorch~centiskorch|9|6|8|0|100|115|65|90|90|65;Clobbopus~clobbopus|1|-1|8|0|50|68|60|50|50|32;Grapploct~grapploct|1|-1|8|0|80|118|90|70|80|42;Sinistea~sinistea|7|-1|8|0|40|45|45|74|54|50;Polteageist~polteageist|7|-1|8|0|60|65|65|134|114|70;Hatenna~hatenna|13|-1|8|0|42|30|45|56|53|39;Hattrem~hattrem|13|-1|8|0|57|40|65|86|73|49;Hatterene~hatterene|13|17|8|0|57|90|95|136|103|29;Impidimp~impidimp|16|17|8|0|45|45|30|55|40|50;Morgrem~morgrem|16|17|8|0|65|60|45|75|55|70;Grimmsnarl~grimmsnarl|16|17|8|0|95|120|65|95|75|60;Obstagoon~obstagoon|16|0|8|0|93|90|101|60|81|95;Perrserker~perrserker|8|-1|8|0|70|110|100|50|60|50;Cursola~cursola|7|-1|8|0|60|95|50|145|130|30;Sirfetch'd~sirfetchd|1|-1|8|0|62|135|95|68|82|65;Mr. Rime~mr-rime|14|13|8|0|80|85|75|110|100|70;Runerigus~runerigus|4|7|8|0|58|95|145|50|105|30;Milcery~milcery|17|-1|8|0|45|40|40|50|61|34;Alcremie~alcremie|17|-1|8|0|65|60|75|110|121|64;Falinks~falinks|1|-1|8|0|65|100|100|70|60|75;Pincurchin~pincurchin|12|-1|8|0|48|101|95|91|85|15;Snom~snom|14|6|8|0|30|25|35|45|30|20;Frosmoth~frosmoth|14|6|8|0|70|65|60|125|90|65;Stonjourner~stonjourner|5|-1|8|0|100|125|135|20|20|70;Eiscue~eiscue|14|-1|8|0|75|80|110|65|90|50;Indeedee~indeedee|13|0|8|0|60|65|55|105|95|95;Morpeko~morpeko|12|16|8|0|58|95|58|70|58|97;Cufant~cufant|8|-1|8|0|72|80|49|40|49|40;Copperajah~copperajah|8|-1|8|0|122|130|69|80|69|30;Dracozolt~dracozolt|12|15|8|0|90|100|90|80|70|75;Arctozolt~arctozolt|12|14|8|0|90|100|90|90|80|55;Dracovish~dracovish|10|15|8|0|90|90|100|70|80|75;Arctovish~arctovish|10|14|8|0|90|90|100|80|90|55;Duraludon~duraludon|8|15|8|0|70|95|115|120|50|85;Dreepy~dreepy|15|7|8|0|28|60|30|40|30|82;Drakloak~drakloak|15|7|8|0|68|80|50|60|50|102;Dragapult~dragapult|15|7|8|0|88|120|75|100|75|142;Zacian~zacian|17|-1|8|1|92|120|115|80|115|138;Zamazenta~zamazenta|1|-1|8|1|92|120|115|80|115|138;Eternatus~eternatus|3|15|8|1|140|85|95|145|95|130;Kubfu~kubfu|1|-1|8|1|60|90|60|53|50|72;Urshifu~urshifu|1|16|8|1|100|130|100|63|60|97;Zarude~zarude|16|11|8|1|105|120|105|70|95|105;Regieleki~regieleki|12|-1|8|1|80|100|50|100|50|200;Regidrago~regidrago|15|-1|8|1|200|100|50|100|50|80;Glastrier~glastrier|14|-1|8|1|100|145|130|65|110|30;Spectrier~spectrier|7|-1|8|1|100|65|60|145|80|130;Calyrex~calyrex|13|11|8|1|100|80|80|80|80|80;Wyrdeer~wyrdeer|0|13|8|0|103|105|72|105|75|65;Kleavor~kleavor|6|5|8|0|70|135|95|45|70|85;Ursaluna~ursaluna|4|0|8|0|130|140|105|45|80|50;Basculegion~basculegion|10|7|8|0|120|112|65|80|75|78;Sneasler~sneasler|1|3|8|0|80|130|60|40|80|120;Overqwil~overqwil|16|3|8|0|85|115|95|65|65|85;Enamorus~enamorus|17|2|8|1|74|115|70|135|80|106";

/* Auto-detects the deployed domain for share links & the share image footer */
const SHARE_URL = typeof window !== "undefined" ? window.location.origin : "https://pokemon13-0.vercel.app";

const TYPES = ["normal","fighting","flying","poison","ground","rock","bug","ghost","steel","fire","water","grass","electric","psychic","ice","dragon","dark","fairy"];

const TYPE_COLORS = {
  normal:"#A8A878", fighting:"#D03028", flying:"#A890F0", poison:"#A040A0",
  ground:"#E0C068", rock:"#B8A038", bug:"#A8B820", ghost:"#705898",
  steel:"#B8B8D0", fire:"#F08030", water:"#6890F0", grass:"#78C850",
  electric:"#F8D030", psychic:"#F85888", ice:"#98D8D8", dragon:"#7038F8",
  dark:"#705848", fairy:"#EE99AC",
};

const MOVES = {
  normal:["HYPER BEAM","BODY SLAM","EXTREME SPEED"],
  fighting:["CLOSE COMBAT","DYNAMIC PUNCH","HIGH JUMP KICK"],
  flying:["BRAVE BIRD","HURRICANE","AERIAL ACE"],
  poison:["SLUDGE BOMB","GUNK SHOT","TOXIC SPIKES"],
  ground:["EARTHQUAKE","EARTH POWER","HIGH HORSEPOWER"],
  rock:["STONE EDGE","ROCK SLIDE","HEAD SMASH"],
  bug:["MEGAHORN","BUG BUZZ","X-SCISSOR"],
  ghost:["SHADOW BALL","PHANTOM FORCE","SHADOW CLAW"],
  steel:["IRON HEAD","METEOR MASH","FLASH CANNON"],
  fire:["FLAMETHROWER","FIRE BLAST","FLARE BLITZ"],
  water:["HYDRO PUMP","SURF","AQUA TAIL"],
  grass:["ENERGY BALL","LEAF STORM","SOLAR BEAM"],
  electric:["THUNDERBOLT","THUNDER","VOLT TACKLE"],
  psychic:["PSYCHIC","PSYSTRIKE","FUTURE SIGHT"],
  ice:["ICE BEAM","BLIZZARD","ICICLE CRASH"],
  dragon:["DRACO METEOR","OUTRAGE","DRAGON PULSE"],
  dark:["DARK PULSE","CRUNCH","FOUL PLAY"],
  fairy:["MOONBLAST","PLAY ROUGH","DAZZLING GLEAM"],
};

/* attacker -> { defender: multiplier } (only non-1 values) */
const CHART = {
  normal:{rock:.5,ghost:0,steel:.5},
  fighting:{normal:2,flying:.5,poison:.5,rock:2,bug:.5,ghost:0,steel:2,psychic:.5,ice:2,dark:2,fairy:.5},
  flying:{fighting:2,rock:.5,bug:2,steel:.5,grass:2,electric:.5},
  poison:{poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,grass:2,fairy:2},
  ground:{flying:0,poison:2,rock:2,bug:.5,steel:2,fire:2,grass:.5,electric:2},
  rock:{fighting:.5,flying:2,ground:.5,bug:2,steel:.5,fire:2,ice:2},
  bug:{fighting:.5,flying:.5,poison:.5,ghost:.5,steel:.5,fire:.5,grass:2,psychic:2,dark:2,fairy:.5},
  ghost:{normal:0,ghost:2,psychic:2,dark:.5},
  steel:{rock:2,steel:.5,fire:.5,water:.5,electric:.5,ice:2,fairy:2},
  fire:{rock:.5,bug:2,steel:2,fire:.5,water:.5,grass:2,ice:2,dragon:.5},
  water:{ground:2,rock:2,fire:2,water:.5,grass:.5,dragon:.5},
  grass:{flying:.5,poison:.5,ground:2,rock:2,bug:.5,steel:.5,fire:.5,water:2,grass:.5,dragon:.5},
  electric:{flying:2,ground:0,water:2,grass:.5,electric:.5,dragon:.5},
  psychic:{fighting:2,poison:2,steel:.5,psychic:.5,dark:0},
  ice:{flying:2,ground:2,grass:2,fire:.5,water:.5,ice:.5,dragon:2,steel:.5},
  dragon:{dragon:2,steel:.5,fairy:0},
  dark:{fighting:.5,ghost:2,psychic:2,dark:.5,fairy:.5},
  fairy:{fighting:2,poison:.5,steel:.5,fire:.5,dragon:2,dark:2},
};

const eff = (atk, defTypes) =>
  defTypes.reduce((m, d) => m * (CHART[atk]?.[d] ?? 1), 1);

/* ---------------- Pokédex ---------------- */
const STAT_KEYS = ["HP","ATK","DEF","SP.A","SP.D","SPE"];
const DEX = DEX_RAW.split(";").map((row, i) => {
  const [nameSlug, t1, t2, gen, leg, ...st] = row.split("|");
  const [name, slug] = nameSlug.split("~");
  const types = [TYPES[+t1]];
  if (+t2 >= 0) types.push(TYPES[+t2]);
  const stats = st.map(Number); // hp atk def spa spd spe
  const bst = stats.reduce((a, b) => a + b, 0);
  const level = Math.min(100, Math.max(10, Math.round(bst / 7.2)));
  return { id: i + 1, name, slug, types, stats, bst, level, gen: +gen, leg: +leg === 1 };
});
const byId = (id) => DEX[id - 1];

const tierOf = (bst) => bst >= 600 ? "S" : bst >= 500 ? "A" : bst >= 420 ? "B" : bst >= 330 ? "C" : "D";
const TIER_COLORS = { S:"#FFCB05", A:"#6CF06C", B:"#5BC8F5", C:"#F4A95C", D:"#9aa6cf" };

/* Spritesheets compiled from PokeAPI / smogon GitHub sources — served from /public */
const POKESHEET = "/pokesheet.webp";
const TRAINERSHEET = "/trainersheet.webp";
const TRAINER_INDEX = {"names": ["Brock", "Misty", "Lt._Surge", "Erika", "Koga", "Sabrina", "Blaine", "Giovanni", "Lorelei", "Bruno", "Agatha", "Lance", "Blue", "Falkner", "Bugsy", "Whitney", "Morty", "Chuck", "Jasmine", "Pryce", "Clair", "Will", "Karen", "Roxanne", "Brawly", "Wattson", "Flannery", "Norman", "Winona", "Tate_and_Liza", "Wallace", "Sidney", "Phoebe", "Glacia", "Drake", "Steven", "Roark", "Gardenia", "Maylene", "Crasher_Wake", "Fantina", "Byron", "Candice", "Volkner", "Aaron", "Bertha", "Flint", "Lucian", "Cynthia", "Cilan", "Lenora", "Burgh", "Elesa", "Clay", "Skyla", "Brycen", "Drayden", "Shauntal", "Grimsley", "Caitlin", "Marshal", "Alder", "Viola", "Grant", "Korrina", "Ramos", "Clemont", "Valerie", "Olympia", "Wulfric", "Malva", "Siebold", "Wikstrom", "Drasna", "Diantha", "Ilima", "Lana", "Kiawe", "Mallow", "Sophocles", "Mina", "Nanu", "Hala", "Olivia", "Molayne", "Acerola", "Kahili", "Kukui", "Milo", "Nessa", "Kabu", "Bea", "Opal", "Gordie", "Piers", "Raihan", "Marnie", "Hop", "Bede", "Mustard", "Leon"], "have": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]};
const DEX_ENTRIES = "Seed Pokémon^While it is young, it uses the nutrients that are stored in the seed on its back in order to grow.;Seed Pokémon^Exposure to sunlight adds to its strength. Sunlight also makes the bud on its back grow larger.;Seed Pokémon^A bewitching aroma wafts from its flower. The fragrance becalms those engaged in a battle.;Lizard Pokémon^From the time it is born, a flame burns at the tip of its tail. Its life would end if the flame were to go out.;Flame Pokémon^If it becomes agitated during battle, it spouts intense flames, incinerating its surroundings.;Flame Pokémon^Its wings can carry this Pokémon close to an altitude of 4,600 feet. It blows out fire at very high temperatures.;Tiny Turtle Pokémon^When it feels threatened, it draws its limbs inside its shell and sprays water from its mouth.;Turtle Pokémon^It cleverly controls its furry ears and tail to maintain its balance while swimming.;Shellfish Pokémon^The rocket cannons on its shell fire jets of water capable of punching holes through thick steel.;Worm Pokémon^Its short feet are tipped with suction pads that enable it to tirelessly climb slopes and walls.;Cocoon Pokémon^Even though it is encased in a sturdy shell, the body inside is tender. It can’t withstand a harsh attack.;Butterfly Pokémon^It collects honey every day. It rubs honey onto the hairs on its legs to carry it back to its nest.;Hairy Bug Pokémon^Beware of the sharp stinger on its head. It hides in grass and bushes where it eats leaves.;Cocoon Pokémon^Able to move only slightly. When endangered, it may stick out its stinger and poison its enemy.;Poison Bee Pokémon^It has three poisonous stingers on its forelegs and its tail. They are used to jab its enemy repeatedly.;Tiny Bird Pokémon^Very docile. If attacked, it will often kick up sand to protect itself rather than fight back.;Bird Pokémon^This Pokémon is full of vitality. It constantly flies around its large territory in search of prey.;Bird Pokémon^This Pokémon flies at Mach 2 speed, seeking prey. Its large talons are feared as wicked weapons.;Mouse Pokémon^Will chew on anything with its fangs. If you see one, you can be certain that 40 more live in the area.;Mouse Pokémon^Its hind feet are webbed. They act as flippers, so it can swim in rivers and hunt for prey.;Tiny Bird Pokémon^Inept at flying high. However, it can fly around very fast to protect its territory.;Beak Pokémon^A Pokémon that dates back many years. If it senses danger, it flies high and away, instantly.;Snake Pokémon^The older it gets, the longer it grows. At night, it wraps its long body around tree branches to rest.;Cobra Pokémon^The frightening patterns on its belly have been studied. Six variations have been confirmed.;Mouse Pokémon^Possesses cheek sacs in which it stores electricity. This clever forest-dweller roasts tough berries with an electric shock before consuming them.;Mouse Pokémon^It can discharge bursts of electricity exceeding 100,000 volts— a single strike with that amount of power would incapacitate one of the Copperajah of my homeland.;Mouse Pokémon^It burrows into the ground to create its nest. If hard stones impede its tunneling, it uses its sharp claws to shatter them and then carries on digging.;Mouse Pokémon^It climbs trees by hooking on with its sharp claws. Sandslash shares the berries it gathers, dropping them down to Sandshrew waiting below the tree.;Poison Pin Pokémon^It uses its hard incisor teeth to crush and eat berries. The tip of a female Nidoran’s horn is a bit more rounded than the tip of a male’s horn.;Poison Pin Pokémon^If the group is threatened, these Pokémon will band together to assault enemies with a chorus of ultrasonic waves.;Drill Pokémon^It pacifies offspring by placing them in the gaps between the spines on its back. The spines will never secrete poison while young are present.;Poison Pin Pokémon^Small but brave, this Pokémon will hold its ground and even risk its life in battle to protect the female it’s friendly with.;Poison Pin Pokémon^It’s nervous and quick to act aggressively. The potency of its poison increases along with the level of adrenaline present in its body.;Drill Pokémon^Nidoking prides itself on its strength. It’s forceful and spirited in battle, making use of its thick tail and diamond-crushing horn.;Fairy Pokémon^It can be found in quiet mountain areas on a full moon's night. Its dancing and its tiny, faintly glowing wings confer upon it a lovely fairylike quality.;Fairy Pokémon^Legend says that on clear, quiet nights, it listens for the voices of its kin living on the moon. I, too, often think of my homeland, so far away.;Fox Pokémon^In its belly burns a fire, which Vulpix spits out in the form of fireballs. When young, this Pokémon has but one white tail. As the Pokémon matures, this single tail…;Fox Pokémon^The coat of gleaming golden fur is quite magnificent. This species is said to store sacred power in its nine long tails and to live for a millennium.;Balloon Pokémon^By freely changing the wavelength of its voice, Jigglypuff sings a mysterious melody sure to make any listener sleepy.;Balloon Pokémon^It’s proud of its fur, which is fine and delicate. In particular, the curl on its forehead has a texture that’s perfectly heavenly.;Bat Pokémon^Makes its home in gloomy caves. Atrophied eyes have left this Pokémon blind, so it scans its surroundings via sound waves that it emits from its mouth as it flies.;Bat Pokémon^It sinks its sharp fangs into other creatures and slurps up their blood. A closer look at the fangs reveals that they are hollow and akin to straws.;Weed Pokémon^During the day, it stays in the cold underground to avoid the sun. It grows by bathing in moonlight.;Weed Pokémon^What appears to be drool is actually sweet honey. It is very sticky and clings stubbornly if touched.;Flower Pokémon^The larger its petals, the more toxic pollen it contains. Its big head is heavy and hard to hold up.;Mushroom Pokémon^Sometimes seen at the foot of trees in humid forests. The mushrooms on its back—called tochukaso—are not present on infant specimens and instead emerge as Paras matures.;Mushroom Pokémon^Mushroom-lacking specimens of this Pokémon lie unmoving in the forest, lending credence to the hypothesis that the large mushroom is in control of Parasect's actions.;Insect Pokémon^Its large eyes act as radar. In a bright place, you can see that they are clusters of many tiny eyes.;Poison Moth Pokémon^The powdery scales on its wings are hard to remove from skin. They also contain poison that leaks out on contact.;Mole Pokémon^It burrows through the ground at a shallow depth. It leaves raised earth in its wake, making it easy to spot.;Mole Pokémon^These Diglett triplets dig over 60 miles below sea level. No one knows what it’s like underground.;Scratch Cat Pokémon^It washes its face regularly to keep the coin on its forehead spotless. It doesn’t get along with Galarian Meowth.;Classy Cat Pokémon^Its elegant and refined behavior clashes with that of the barbaric Perrserker. The relationship between the two is one of mutual disdain.;Duck Pokémon^Suffers perpetual headaches. If the agony grows too great, Psyduck's latent power erupts, contrary to Psyduck's intent. Ergo, I am exploring ways to ease the pain.;Duck Pokémon^Its body is strong, and it has webbing on its hands and feet. Golduck can swim easily through rough seas, clawing its way through the high waves.;Pig Monkey Pokémon^An agile Pokémon that lives in trees. It angers easily and will not hesitate to attack anything.;Pig Monkey Pokémon^It stops being angry only when nobody else is around. To view this moment is very difficult.;Puppy Pokémon^They patrol their territory in pairs. I believe the igneous rock components in the fur of this species are the result of volcanic activity in its habitat.;Legendary Pokémon^Snaps at its foes with fangs cloaked in blazing flame. Despite its bulk, it deftly feints every which way, leading opponents on a deceptively merry chase as it all…;Tadpole Pokémon^In rivers with fast-flowing water, this Pokémon will cling to a rock by using its thick lips, which act like a suction cup.;Tadpole Pokémon^This Pokémon’s sweat is a slimy mucus. When captured, Poliwhirl can slither from its enemies’ grasp and escape.;Tadpole Pokémon^Poliwrath is skilled at both swimming and martial arts. It uses its well-trained arms to dish out powerful punches.;Psi Pokémon^Spends 18 hours of the day sleeping. Even while asleep, Abra can control its psychic powers—should danger approach, the Pokémon will simply teleport away.;Psi Pokémon^There are rumors that a child with mystical powers became a Kadabra, however, this remains unverified. I suspect that the spoon Kadabra holds enhances its brain waves.;Psi Pokémon^The longer Alakazam lives, the larger and heavier its head becomes. Our tests have shown that the strength of its psychic powers correlates positively to the weight…;Superpower Pokémon^Though as small as a child, it has strength enough to easily throw a well-built adult. Striving to become ever stronger, Machop trains by carrying a Graveler on its…;Superpower Pokémon^A sturdy creature boasting a robust physique and boundless stamina. Loves training above all else and voluntarily assists with tasks such as construction and clearing…;Superpower Pokémon^In close combat, its four arms afford it offensive and defensive supremacy. In but a blink, this valiant Pokémon can overwhelm its foes with more than 1,000 blows…;Flower Pokémon^Prefers hot and humid places. It ensnares tiny bugs with its vines and devours them.;Flycatcher Pokémon^When hungry, it swallows anything that moves. Its hapless prey is dissolved by strong acids.;Flycatcher Pokémon^Lures prey with the sweet aroma of honey. Swallowed whole, the prey is dissolved in a day, bones and all.;Jellyfish Pokémon^They fire beams from the glassy, magenta orbs that resemble eyes atop their heads, and they drift in shallow seas. During low tide, they can sometimes be found on…;Jellyfish Pokémon^It has 80 tentacles, each with a venomous tip. These tentacles are also extendible, lengthening when Tentacruel attempts to catch prey. Use caution.;Rock Pokémon^Makes its home in mountainous regions, using its arms to climb along harsh mountain roads. Can be troublesome—carelessly kicking one will cause it to fly into a rage…;Rock Pokémon^Dwells in holes dug into sheer walls of stone. It enjoys rolling down slopes as though it were a boulder during a rockfall, so keep an eye upward while traversing…;Megaton Pokémon^The rocklike shell is shed each year. The cast-off shell then crumbles, reverting to a mass of soil, which can be spread across fields to promote crop growth.;Fire Horse Pokémon^These Pokémon live in herds out in the grassland. Newborn foals lack their fiery manes, which will develop about an hour after birth.;Fire Horse Pokémon^Fiery mane aglow, Rapidash darts like an arrow across the land. This prodigiously swift creature can traverse the vast region of Hisui in a day and a half.;Dopey Pokémon^When this Pokémon’s tail is soaked in water, sweetness seeps from it. Slowpoke uses this trait to lure in and fish up other Pokémon.;Hermit Crab Pokémon^Being bitten by a Shellder shocked this Pokémon into standing on two legs. If the Shellder lets go, it seems Slowbro will turn back into a Slowpoke.;Magnet Pokémon^A bizarre Pokémon with but a single eye embedded in an iron sphere. I suspect this creature levitates due to the magnetism it emits from its arms, which resemble…;Magnet Pokémon^Three Magnemite gathered to evolve into this Pokémon. The source of much vexation on my part, as its powerful magnetism destroys my research equipment.;Wild Duck Pokémon^They use a plant stalk as a weapon, but not all of them use it in the same way. Several distinct styles of stalk fighting have been observed.;Twin Bird Pokémon^Its short wings make flying difficult. Instead, this Pokémon runs at high speed on developed legs.;Triple Bird Pokémon^One of Doduo’s two heads splits to form a unique species. It runs close to 40 mph in prairies.;Sea Lion Pokémon^Loves freezing-cold conditions. Relishes swimming in a frigid climate of around 14 degrees Fahrenheit.;Sea Lion Pokémon^Its entire body is a snowy white. Unharmed by even intense cold, it swims powerfully in icy waters.;Sludge Pokémon^Made of congealed sludge. It smells too putrid to touch. Even weeds won’t grow in its path.;Sludge Pokémon^Smells so awful, it can cause fainting. Through degeneration of its nose, it lost its sense of smell.;Bivalve Pokémon^Its hard shell repels any kind of attack. It is vulnerable only when its shell is open.;Bivalve Pokémon^Once it slams its shell shut, it is impossible to open, even by those with superior strength.;Gas Pokémon^Gaseous and completely impalpable. Also highly dangerous— inhaling part of its poisonous body will cause one to faint instantly.;Gas Pokémon^This frightful, malevolent spirit can glide through walls, appearing wherever it likes. According to rumor, victims of a Haunter's lick will wither to death day by day.;Shadow Pokémon^Possesses potential victims' shadows in an effort to steal away the victims' lives. If your shadow begins to laugh, you must take hold of a protective charm posthaste!;Rock Snake Pokémon^This chain of immense stones resembles a giant serpent. Tremors shake the earth above as it burrows deep beneath the ground, feeding on boulders as it goes.;Hypnosis Pokémon^If you sleep by it all the time, it will sometimes show you dreams it had eaten in the past.;Hypnosis Pokémon^Avoid eye contact if you come across one. It will try to put you to sleep by using its pendulum.;River Crab Pokémon^If it senses danger approaching, it cloaks itself with bubbles from its mouth so it will look bigger.;Pincer Pokémon^Its oversized claw is very powerful, but when it’s not in battle, the claw just gets in the way.;Ball Pokémon^An enigmatic Pokémon that happens to bear a resemblance to a Poké Ball. When excited, it discharges the electric current it has stored in its belly, then lets out a…;Ball Pokémon^The tissue on the surface of its body is curiously similar in composition to an Apricorn. When irritated, this Pokémon lets loose an electric current equal to 20…;Egg Pokémon^These Pokémon get nervous when they’re not in a group of six. The minute even one member of the group goes missing, Exeggcute become cowardly.;Coconut Pokémon^When they work together, Exeggutor’s three heads can put out powerful psychic energy. Cloudy days make this Pokémon sluggish.;Lonely Pokémon^This Pokémon wears the skull of its deceased mother. Sometimes Cubone’s dreams make it cry, but each tear Cubone sheds makes it stronger.;Bone Keeper Pokémon^When this Pokémon evolved, the skull of its mother fused to it. Marowak’s temperament also turned vicious at the same time.;Kicking Pokémon^The legs freely contract and stretch. The stretchy legs allow it to hit a distant foe with a rising kick.;Punching Pokémon^Its punches slice the air. However, it seems to need a short break after fighting for three minutes.;Licking Pokémon^Wields its long tongue deftly, as though it were an arm. The Pokémon's viscous saliva, once it has been collected and boiled down, yields a strong and highly useful…;Poison Gas Pokémon^It adores polluted air. Some claim that Koffing used to be more plentiful in the Galar region than they are now.;Poison Gas Pokémon^It can’t suck in air quite as well as a Galarian Weezing, but the toxins it creates are more potent than those of its counterpart.;Spikes Pokémon^Ludicrously strong—when it butts heads with a mountain, it is the mountain that shatters. But its short legs struggle with turns, and it is incapable of stopping…;Drill Pokémon^Rapidly rotates its horn to bore through bedrock. It swaggers around volcanic regions, protected from the lava's heat by its tough, armorlike hide.;Egg Pokémon^This purehearted Pokémon shares its eggs with the injured.;Vine Pokémon^It is cloaked entirely in blue vines, preventing any glimpse of its true identity. The vines impart a refreshing sensation when chewed—they're useful as a spice.;Parent Pokémon^There are records of a lost human child being raised by a childless Kangaskhan.;Dragon Pokémon^They swim with dance-like motions and cause whirlpools to form. Horsea compete to see which of them can generate the biggest whirlpool.;Dragon Pokémon^Seadra’s mouth is slender, but its suction power is strong. In an instant, Seadra can suck in food that’s larger than the opening of its mouth.;Goldfish Pokémon^Its dorsal and pectoral fins are strongly developed like muscles. It can swim at a speed of five knots.;Goldfish Pokémon^Using its horn, it bores holes in riverbed boulders, making nests to prevent its eggs from washing away.;Star Shape Pokémon^Fish Pokémon nibble at it, but Staryu isn’t bothered. Its body regenerates quickly, even if part of it is completely torn off.;Mysterious Pokémon^Starmie swims by spinning its body at high speed. As this Pokémon cruises through the ocean, it absorbs tiny plankton.;Barrier Pokémon^The behavior of this clown-like Pokémon reminds one of pantomime. It creates invisible walls using a force emitted from its fingertips.;Mantis Pokémon^The large, wickedly sharp scythes on its forearms are truly fearsome weapons. Prey's attempts to flee are unfailingly thwarted by this Pokémon's nimble motions.;Human Shape Pokémon^The Jynx of Galar often have beautiful and delicate voices. Some of these Pokémon have even gathered a fan base.;Electric Pokémon^Feeds on electrical energy. During sudden showers beneath looming thunderclouds, one can observe Electabuzz scaling tall trees, where the Pokémon will then wait for…;Spitfire Pokémon^Legend has it that this Pokémon was born from the crater of a volcano. When wounded, it bathes in lava to heal its body, much as one would soak in a hot spring.;Stag Beetle Pokémon^This Pokémon clamps its pincers down on its prey and then either splits the prey in half or flings it away.;Wild Bull Pokémon^The Tauros of the Galar region are volatile in nature, and they won’t allow people to ride on their backs.;Fish Pokémon^A feeble, pitiful imbecile of a Pokémon that is nonetheless very hardy. Unperturbed by turbid water, it can be found living in all sorts of places.;Atrocious Pokémon^I suspect this Pokémon to be the true identity of a dragon written of in ancient texts, which claimed that it razed an entire village with white-hot beams from its maw.;Transport Pokémon^Crossing icy seas is no issue for this cold-resistant Pokémon. Its smooth skin is a little cool to the touch.;Transform Pokémon^When it encounters another Ditto, it will move faster than normal to duplicate that opponent exactly.;Evolution Pokémon^Harbors the potential to evolve into manifold forms. Within Eevee lies the key to the mysteries of Pokémon evolution—I'm certain of it.;Bubble Jet Pokémon^Tests show that its cells closely resemble water molecules, which perhaps explains its ability to conceal its form while submerged. I believe the origins of mermaid…;Lightning Pokémon^Bristles its fur into sharp, needlelike points when enraged. One can hear electricity crackle in its breath when it exhales.;Flame Pokémon^Flames burn within a saclike organ inside this Pokémon. When Flareon inhales, these flames grow in intensity, reaching a mighty 3,000 degrees Fahrenheit.;Virtual Pokémon^It has no discernible heartbeat and does not seem to draw breath, and yet it appears to function without issue. I cannot even begin to explain this utterly bizarre…;Spiral Pokémon^This Pokémon is a member of an ancient, extinct species. Omanyte paddles through water with its 10 tentacles, looking like it’s just drifting along.;Spiral Pokémon^Omastar’s sharp fangs could crush rock, but the Pokémon can attack only the prey that come within reach of its tentacles.;Shellfish Pokémon^While some say this species has gone extinct, Kabuto sightings are apparently fairly common in some places.;Shellfish Pokémon^The cause behind the extinction of this species is unknown. Kabutops were aggressive Pokémon that inhabited warm seas.;Fossil Pokémon^Aerodactyl’s sawlike fangs can shred skin to tatters—even the skin of Steel-type Pokémon.;Sleeping Pokémon^This glutton appears in villages without warning and devours the entirety of their rice granaries—such occurrences have long been counted among the gravest of disasters.;Freeze Pokémon^This Pokémon can control ice at will. Articuno is said to live in snowy mountains riddled with permafrost.;Electric Pokémon^Zapdos is a legendary bird Pokémon. It’s said that when Zapdos rubs its feathers together, lightning will fall immediately after.;Flame Pokémon^There are stories of this Pokémon using its radiant, flame-cloaked wings to light up paths for those lost in the mountains.;Dragon Pokémon^This Pokémon was long considered to be no more than a myth. The small lump on a Dratini’s forehead is actually a horn that’s still coming in.;Dragon Pokémon^This Pokémon gathers power in the orbs on its tail and controls the weather. When enshrouded by an aura, Dragonair has a mystical appearance.;Dragon Pokémon^This Pokémon is known as the Sea Incarnate. Figureheads that resemble Dragonite decorate the bows of many ships.;Genetic Pokémon^Its DNA is almost the same as Mew’s. However, its size and disposition are vastly different.;New Species Pokémon^When viewed through a microscope, this Pokémon’s short, fine, delicate hair can be seen.;Leaf Pokémon^In battle, Chikorita waves its leaf around to keep the foe at bay. However, a sweet fragrance also wafts from the leaf, becalming the battling Pokémon and creating a…;Leaf Pokémon^Bayleef’s neck is ringed by curled-up leaves. Inside each tubular leaf is a small shoot of a tree. The fragrance of this shoot makes people peppy.;Herb Pokémon^The fragrance of Meganium’s flower soothes and calms emotions. In battle, this Pokémon gives off more of its becalming scent to blunt the foe’s fighting spirit.;Fire Mouse Pokémon^Hails from the Johto region. Though usually curled into a ball due to its timid disposition, it harbors tremendous firepower.;Volcano Pokémon^This creature's fur is most mysterious—it is wholly impervious to the burning touch of flame. Should Quilava turn its back to you, take heed! Such a posture indicates…;Volcano Pokémon^Said to purify lost, forsaken souls with its flames and guide them to the afterlife. I believe its form has been influenced by the energy of the sacred mountain…;Big Jaw Pokémon^Despite the smallness of its body, Totodile’s jaws are very powerful. While the Pokémon may think it is just playfully nipping, its bite has enough power to cause…;Big Jaw Pokémon^Once Croconaw has clamped its jaws on its foe, it will absolutely not let go. Because the tips of its fangs are forked back like barbed fishhooks, they become…;Big Jaw Pokémon^Feraligatr intimidates its foes by opening its huge mouth. In battle, it will kick the ground hard with its thick and powerful hind legs to charge at the foe at an…;Scout Pokémon^When Sentret sleeps, it does so while another stands guard. The sentry wakes the others at the first sign of danger. When this Pokémon becomes separated from its…;Long Body Pokémon^Furret has a very slim build. When under attack, it can slickly squirm through narrow spaces and get away. In spite of its short limbs, this Pokémon is very nimble…;Owl Pokémon^It begins to hoot at the same time every day. Some Trainers use them in place of clocks.;Owl Pokémon^When it needs to think, it rotates its head 180 degrees to sharpen its intellectual power.;Five Star Pokémon^These very cowardly Pokémon join together and use Reflect to protect their nest.;Five Star Pokémon^It flies through the night sky, sprinkling sparkly dust. According to some, if that dust sticks to you, good things will happen to you.;String Spit Pokémon^Although the poison from its fangs isn’t that strong, it’s potent enough to weaken prey that gets caught in its web.;Long Leg Pokémon^It spews threads from its mouth to catch its prey. When night falls, it leaves its web to go hunt aggressively.;Bat Pokémon^Its hind limbs have become another set of wings. Crobat expertly maneuvers its four wings to dart in exquisite fashion through even the most confined caves without…;Angler Pokémon^On the dark ocean floor, its only means of communication is its constantly flashing lights.;Light Pokémon^This Pokémon flashes a bright light that blinds its prey. This creates an opening for it to deliver an electrical attack.;Tiny Mouse Pokémon^Pichu stores electricity in the sacs on its cheeks but discharges it inadvertently when agitated or excited. Being yet immature, the Pokémon's handling of electricity…;Star Shape Pokémon^In silhouette, they resemble twinkling starlight. When shooting stars rain from the night sky, Cleffa gather in numbers and dance as though they are indeed…;Balloon Pokémon^Taking advantage of the softness of its body, Igglybuff moves as if bouncing. Its body turns a deep pink when its temperature rises.;Spike Ball Pokémon^This ovate creature is frequently mistaken for a moving egg when encountered out in the fields or in the mountains. Its guileless smile soothes the soul.;Happiness Pokémon^No records exist of Togetic being seen in the wilds. Rumors abound that it evolves under the loving care of a trusted human companion, upon whom the Pokémon then…;Tiny Bird Pokémon^Because its wings aren’t yet fully grown, it has to hop to get around. It is always staring at something.;Mystic Pokémon^This odd Pokémon can see both the past and the future. It eyes the sun’s movement all day.;Wool Pokémon^Rubbing its fleece generates electricity. You’ll want to pet it because it’s cute, but if you use your bare hand, you’ll get a painful shock.;Wool Pokémon^It stores electricity in its fluffy fleece. If it stores up too much, it will start to go bald in those patches.;Light Pokémon^Its tail shines bright and strong. It has been prized since long ago as a beacon for sailors.;Flower Pokémon^Bellossom gather at times and appear to dance. They say that the dance is a ritual to summon the sun.;Aqua Mouse Pokémon^Even after Marill swims in a cold sea, its water- repellent fur dries almost as soon as Marill leaves the water. That’s why this Pokémon is never cold.;Aqua Rabbit Pokémon^These Pokémon create air-filled bubbles. When Azurill play in rivers, Azumarill will cover them with these bubbles.;Imitation Pokémon^Though it pretends to be a tree, it fails to fool even children. To the touch, its body feels more like rock than tree bark. Sudowoodo's extreme aversion to water…;Frog Pokémon^The cry of a male is louder than that of a female. Male Politoed with deep, menacing voices find more popularity with the opposite gender.;Cottonweed Pokémon^This Pokémon drifts and floats with the wind. If it senses the approach of strong winds, Hoppip links its leaves with other Hoppip to prepare against being blown away.;Cottonweed Pokémon^Skiploom’s flower blossoms when the temperature rises above 64 degrees Fahrenheit. How much the flower opens depends on the temperature. For that reason, this Pokémon…;Cottonweed Pokémon^Jumpluff rides warm southern winds to cross the sea and fly to foreign lands. The Pokémon descends to the ground when it encounters cold air while it is floating.;Long Tail Pokémon^This treetop dweller possesses a tail as dexterous as a hand. Ancient writings describe this Pokémon as a one-armed oddity.;Seed Pokémon^Sunkern tries to move as little as it possibly can. It does so because it tries to conserve all the nutrients it has stored in its body for its evolution. It will not…;Sun Pokémon^Sunflora converts solar energy into nutrition. It moves around actively in the daytime when it is warm. It stops moving as soon as the sun goes down for the night.;Clear Wing Pokémon^Its frail wings are so thin that one can see clear through them. However, during flight these wings exhibit the power to churn air with force enough to launch a house…;Water Fish Pokémon^When walking on land, it covers its body with a poisonous film that keeps its skin from dehydrating.;Water Fish Pokémon^Its body is always slimy. It often bangs its head on the river bottom as it swims but seems not to care.;Sun Pokémon^Wields an arcane power with which it can predict the weather and even people's thoughts. When bathed in sunshine, the scarlet orb on its brow glows and builds energy.;Moonlight Pokémon^It is most active in the wee hours of the night, when moonlight bathes the land. Its large eyes can pierce the darkness and perceive prey with absolute clarity.;Darkness Pokémon^Widely shunned as a bearer of ill fortune. Upon crossing paths with this creature, I've been told one must chant ”Workrum, Workrum—bad luck, don't come” as a…;Royal Pokémon^Slowking can solve any problem presented to it, but no one can understand a thing Slowking says.;Screech Pokémon^It conceals itself in darkness, sending chills up travelers' spines with its childlike weeping. As it observes the frightened travelers with glee, the red orbs upon…;Symbol Pokémon^It is hard to believe these strangely shaped Pokémon are truly living creatures. I've pointed out that the species' many forms resemble writing from other lands, no…;Patient Pokémon^To keep its pitch-black tail hidden, it lives quietly in the darkness. It is never first to attack.;Long Neck Pokémon^Girafarig’s rear head contains a tiny brain that is too small for thinking. However, the rear head doesn’t need to sleep, so it can keep watch over its surroundings…;Bagworm Pokémon^It sticks tree bark to itself with its saliva, making itself thicker and larger. Elderly Pineco are ridiculously huge.;Bagworm Pokémon^In the moment that it gulps down its prey, the inside of its shell is exposed, but to this day, no one has ever seen that sight.;Land Snake Pokémon^The nests Dunsparce live in are mazes of tunnels. They never get lost in their own nests—they can tell where they are by the scent of the dirt.;Fly Scorpion Pokémon^Its tail is tipped by a thick, horrible stinger. To bring down prey, it will first obscure their vision by covering their faces with its body, and then it will use…;Iron Snake Pokémon^This Pokémon evolved through use of a strange item. Its body is coated with steel powder and notably hard—not even diamond can leave so much as a scratch.;Fairy Pokémon^In contrast to its appearance, it’s quite timid. When playing with other puppy Pokémon, it sometimes gets bullied.;Fairy Pokémon^Although it’s popular with young people, Granbull is timid and sensitive, so it’s totally incompetent as a watchdog.;Balloon Pokémon^Fishers detest this troublesome Pokémon because it sprays poison from its spines, getting it everywhere. A different form of Qwilfish lives in other regions.;Pincer Pokémon^Evolved by way of a curious item. The shell covering its body has been shown to be stronger than forged steel.;Mold Pokémon^The berries stored in its vaselike shell eventually become a thick, pulpy juice.;Single Horn Pokémon^This Pokémon has an unparalleled horn. Heracross itself demonstrates tremendous power—it's capable of throwing several people trained in the traditional arts of war…;Sharp Claw Pokémon^Its sturdy, curved claws are ideal for traversing precipitous cliffs. From the tips of these claws drips a venom that infiltrates the nerves of any prey caught in…;Little Bear Pokémon^It licks its paws because of the sweet honey that has soaked into them. It is cunning, stealing into the nests of Combee and taking for itself the honey that the…;Hibernator Pokémon^When the cold season arrives in Hisui, this Pokémon will wander fields and mountains alike in search of its favorite berries. Ursaring's hunger during this time makes…;Lava Pokémon^Slugma does not have any blood in its body. Instead, intensely hot magma circulates throughout this Pokémon’s body, carrying essential nutrients and oxygen to its organs.;Lava Pokémon^Magcargo’s body temperature is approximately 18,000 degrees Fahrenheit. Water is vaporized on contact. If this Pokémon is caught in the rain, the raindrops instantly…;Pig Pokémon^Swinub excels at sniffing out mushrooms buried beneath grass or snow. Since ancient times, the people of Hisui have often relied upon this skill.;Swine Pokémon^The long fur of this Pokémon covers its eyes, ears, and even limbs, allowing Piloswine to resist harshly frigid conditions. The Pokémon's white tusks can be used to…;Coral Pokémon^These Pokémon live in warm seas. In prehistoric times, many lived in the oceans around the Galar region as well.;Jet Pokémon^Spits water from its mouth with incredible accuracy. It captures Burmy by shooting them down off the branches from which they dangle.;Jet Pokémon^While Octillery still shoots water from its mouth, the drastic anatomical difference between it and Remoraid meant that for a long time, no one believed the former…;Delivery Pokémon^It has a generous habit of sharing its food with people and Pokémon, so it’s always scrounging around for more food.;Kite Pokémon^This calm and gentle Pokémon swims gracefully through the sea. After building speed, it can leap out of the water. It is often misidentified as a bird Pokémon due to…;Armor Bird Pokémon^People fashion swords from Skarmory’s shed feathers, so this Pokémon is a popular element in heraldic designs.;Dark Pokémon^They make repeated eerie howls before dawn to call attention to their pack.;Dark Pokémon^Identifiable by its eerie howls, people a long time ago thought it was the grim reaper and feared it.;Dragon Pokémon^Scales shed by this Pokémon have such a splendorous gleam to them that they’ve been given to royalty as gifts.;Long Nose Pokémon^Phanpy uses its long nose to shower itself. When others gather around, they thoroughly douse each other with water. These Pokémon can be seen drying their soaking-wet…;Armor Pokémon^If Donphan were to tackle with its hard body, even a house could be destroyed. Using its massive strength, the Pokémon helps clear rock and mud slides that block…;Virtual Pokémon^A bizarre item caused this Pokémon to evolve. While it now exhibits many new gestures and expressions, its biology remains inscrutable.;Big Horn Pokémon^Its strangely shaped antlers have the power to bewitch those who see them. Medicine made by grinding up the black orbs from fallen antlers is an effective treatment…;Painter Pokémon^It draws symbols with the fluid that oozes from the tip of its tail. Depending on the symbol, Smeargle fanatics will pay big money for them.;Scuffle Pokémon^Even though it is small, it can’t be ignored because it will slug any handy target without warning.;Handstand Pokémon^After doing a handstand to throw off the opponent’s timing, it presents its fancy kick moves.;Kiss Pokémon^This is a very curious Pokémon. Smoochum decides what it likes and dislikes by touching things with its lips.;Electric Pokémon^They generate electricity by spinning their arms. During a thunderstorm, if one hears the lively voices of children out in the wilderness, what one is actually…;Live Coal Pokémon^This Pokémon lives in volcanic areas. With each breath, sparks spurt from its mouth and nose. When Magby is in good health, its flames gain a yellow tint.;Milk Cow Pokémon^This Pokémon needs to be milked every day, or else it will fall ill. The flavor of Miltank milk changes with the seasons.;Happiness Pokémon^A kindhearted Pokémon that will care for any sick person or Pokémon until their health improves. The eggs it lays are delicious and bring good fortune to those who…;Thunder Pokémon^Raikou embodies the speed of lightning. The roars of this Pokémon send shock waves shuddering through the air and shake the ground as if lightning bolts had come…;Volcano Pokémon^Entei embodies the passion of magma. This Pokémon is thought to have been born in the eruption of a volcano. It sends up massive bursts of fire that utterly consume…;Aurora Pokémon^Suicune embodies the compassion of a pure spring of water. It runs across the land with gracefulness. This Pokémon has the power to purify dirty water.;Rock Skin Pokémon^It feeds on soil. After it has eaten a large mountain, it will fall asleep so it can grow.;Hard Shell Pokémon^It will not stay still, even while it’s a pupa. It already has arms and legs under its solid shell.;Armor Pokémon^The quakes caused when it walks make even great mountains crumble and change the surrounding terrain.;Diving Pokémon^Lugia’s wings pack devastating power—a light fluttering of its wings can blow apart regular houses. As a result, this Pokémon chooses to live out of sight deep under…;Rainbow Pokémon^Ho-Oh’s feathers glow in seven colors depending on the angle at which they are struck by light. These feathers are said to bring happiness to the bearers. This…;Time Travel Pokémon^This Pokémon traveled through time to come from the future. It bolsters grass and trees with its own strength, and it can heal wounds, too.;Wood Gecko Pokémon^Treecko is cool, calm, and collected—it never panics under any situation. If a bigger foe were to glare at this Pokémon, it would glare right back without conceding…;Wood Gecko Pokémon^This Pokémon adeptly flies from branch to branch in trees. In a forest, no Pokémon can ever hope to catch a fleeing Grovyle however fast they may be.;Forest Pokémon^Sceptile has seeds growing on its back. They are said to be bursting with nutrients that revitalize trees. This Pokémon raises the trees in a forest with loving care.;Chick Pokémon^Torchic has a place inside its body where it keeps its flame. Give it a hug—it will be glowing with warmth. This Pokémon is covered all over by a fluffy coat of down.;Young Fowl Pokémon^Combusken battles with the intensely hot flames it spews from its beak and with outstandingly destructive kicks. This Pokémon’s cry is very loud and distracting.;Blaze Pokémon^Blaziken has incredibly strong legs—it can easily clear a 30-story building in one leap. This Pokémon’s blazing punches leave its foes scorched and blackened.;Mud Fish Pokémon^In water, Mudkip breathes using the gills on its cheeks. If it is faced with a tight situation in battle, this Pokémon will unleash its amazing power—it can crush…;Mud Fish Pokémon^Marshtomp is much faster at traveling through mud than it is at swimming. This Pokémon’s hindquarters exhibit obvious development, giving it the ability to walk on…;Mud Fish Pokémon^Swampert predicts storms by sensing subtle differences in the sounds of waves and tidal winds with its fins. If a storm is approaching, it piles up boulders to…;Bite Pokémon^Poochyena is an omnivore—it will eat anything. A distinguishing feature is how large its fangs are compared to its body. This Pokémon tries to intimidate its foes by…;Bite Pokémon^Mightyena travel and act as a pack in the wild. The memory of its life in the wild compels the Pokémon to obey only those Trainers that it recognizes to possess…;Tiny Raccoon Pokémon^Zigzagoon that adapted to regions outside Galar acquired this appearance. If you’ve lost something, this Pokémon can likely find it.;Rushing Pokémon^It uses its explosive speed and razor-sharp claws to bring down prey. Running along winding paths is not its strong suit.;Worm Pokémon^Likes sap and is abundant in the wild. Why it evolves into various different forms is unknown. One cannot tell from a Wurmple's appearance which form it will take…;Cocoon Pokémon^Wraps itself in thin strings of silk while it stores energy for evolution. It can't extend its limbs and its movement is slow, but its eyes keep a sharp…;Butterfly Pokémon^A colorful and incredibly beautiful but also greedy Pokémon. In an effort to keep its favorite food all to itself, it will chase away Combee as they try to gather nectar.;Cocoon Pokémon^The silk coating its body is thin but sufficiently strong. Cascoon's silk has a luster and texture superior to that of Silcoon's, and clothes made using Cascoon silk…;Poison Moth Pokémon^Tends to be drawn to bonfires on dark nights. Difficult to chase away from settlements because of the way it scatters highly toxic scales.;Water Weed Pokémon^Its leaf grew too large for it to live on land. That is how it began to live floating in the water.;Jolly Pokémon^It lives at the water’s edge where it is sunny. It sleeps on a bed of water grass by day and becomes active at night.;Carefree Pokémon^If it hears festive music, it begins moving in rhythm in order to amplify its power.;Acorn Pokémon^It attaches itself to a tree branch using the top of its head. Strong winds can sometimes make it fall.;Wily Pokémon^They live in holes bored in large trees. The sound of Nuzleaf’s grass flute fills listeners with dread.;Wicked Pokémon^It lives quietly in the deep forest. It is said to create chilly winter winds with the fans it holds.;Tiny Swallow Pokémon^Taillow is young—it has only just left its nest. As a result, it sometimes becomes lonesome and cries at night. This Pokémon feeds on Wurmple that live in forests.;Swallow Pokémon^Swellow is very conscientious about the upkeep of its glossy wings. Once two Swellow are gathered, they diligently take care of cleaning each other’s wings.;Seagull Pokémon^It soars on updrafts without flapping its wings. It makes a nest on sheer cliffs at the sea’s edge.;Water Bird Pokémon^Skimming the water’s surface, it dips its large bill in the sea, scoops up food and water, and carries it.;Feeling Pokémon^Tends to prefer people with a chipper disposition to those who are gloomy, but it has shown no discrimination with regard to age or gender. Needs more research.;Emotion Pokémon^It resembles a maiden in appearance, but it wields strange powers to project visions of paradise. I suspect the crimson ornaments on its head are the key to its…;Embrace Pokémon^It will dedicate itself to defending a master it has come to adore. Its pure white dress, reminiscent of those worn by ladies of nobility, is the dress of one who is…;Pond Skater Pokémon^It lives in ponds and marshes that feature lots of plant life. It often fights with Dewpider, whose habitat and diet are similar.;Eyeball Pokémon^Its thin, winglike antennae are highly absorbent. It waits out rainy days in tree hollows.;Mushroom Pokémon^If Shroomish senses danger, it shakes its body and scatters spores from the top of its head. This Pokémon’s spores are so toxic, they make trees and weeds wilt.;Mushroom Pokémon^The seeds ringing Breloom’s tail are made of hardened toxic spores. It is horrible to eat the seeds. Just taking a bite of this Pokémon’s seed will cause your stomach…;Slacker Pokémon^Slakoth’s heart beats just once a minute. Whatever happens, it is content to loaf around motionless. It is rare to see this Pokémon in motion.;Wild Monkey Pokémon^Vigoroth is simply incapable of remaining still. Even when it tries to sleep, the blood in its veins grows agitated, compelling this Pokémon to run wild throughout…;Lazy Pokémon^Wherever Slaking live, rings of over a yard in diameter appear in grassy fields. They are made by the Pokémon as it eats all the grass within reach while lying prone…;Trainee Pokémon^It can sometimes live underground for more than 10 years. It absorbs nutrients from the roots of trees.;Ninja Pokémon^This Pokémon is so quick, it is said to be able to avoid any attack. It loves to feed on tree sap.;Shed Pokémon^A strange Pokémon—it flies without moving its wings, has a hollow shell for a body, and does not breathe.;Whisper Pokémon^When Whismur cries, the sound of its own voice startles it, making the Pokémon cry even louder. It cries until it’s exhausted, then it falls asleep.;Big Voice Pokémon^The force of this Pokémon’s loud voice isn’t just the sound—it’s also the wave of air pressure that blows opponents away and damages them.;Loud Noise Pokémon^This Pokémon can do more than just shout. To communicate with others of its kind, it’ll emit all sorts of sounds from the holes in its body.;Guts Pokémon^There’s a rumor of a traditional recipe for stew that Trainers can use to raise strong Makuhita.;Arm Thrust Pokémon^Hariyama that are big and fat aren’t necessarily strong. There are some small ones that move nimbly and use moves skillfully.;Polka Dot Pokémon^Although Azurill are normally docile, an angry one will swing around the big ball on its tail and try to smash its opponents.;Compass Pokémon^Once the people of Hisui discovered that its red nose always points north, they grew to rely on it greatly when traveling afar. The nose seems to work in a similar…;Kitten Pokémon^Skitty is known to chase around playfully after its own tail. In the wild, this Pokémon lives in holes in the trees of forests. It is very popular as a pet because of…;Prim Pokémon^Delcatty sleeps anywhere it wants without keeping a permanent nest. If other Pokémon approach it as it sleeps, this Pokémon will never fight—it will just move away…;Darkness Pokémon^It feeds on gemstone crystals. In darkness, its eyes sparkle with the glitter of jewels.;Deceiver Pokémon^It chomps with its gaping mouth. Its huge jaws are actually steel horns that have been transformed.;Iron Armor Pokémon^When Aron evolves, its steel armor peels off. In ancient times, people would collect Aron’s shed armor and make good use of it in their daily lives.;Iron Armor Pokémon^During territorial disputes, Lairon fight by slamming into each other. Close inspection of their steel armor reveals scratches and dents.;Iron Armor Pokémon^Long ago, there was a king who wore a helmet meant to resemble the head of an Aggron. He was trying to channel the Pokémon’s strength.;Meditate Pokémon^Meditite heightens its inner energy through meditation. It survives on just one berry a day. Minimal eating is another aspect of this Pokémon’s training.;Meditate Pokémon^Through the power of meditation, Medicham developed its sixth sense. It gained the ability to use psychokinetic powers. This Pokémon is known to meditate for a whole…;Lightning Pokémon^It stores electricity in its fur. It gives off sparks from all over its body in seasons when the air is dry.;Discharge Pokémon^It rarely appears before people. It is said to nest where lightning has fallen.;Cheering Pokémon^When Plusle is cheering on its partner, it flashes with electric sparks from all over its body. If its partner loses, this Pokémon cries loudly.;Cheering Pokémon^Minun loves to cheer on its partner in battle. It gives off sparks from its body while it is doing so. If its partner is in trouble, this Pokémon gives off increasing…;Firefly Pokémon^Volbeat’s tail glows like a lightbulb. With other Volbeat, it uses its tail to draw geometric shapes in the night sky. This Pokémon loves the sweet aroma given off by…;Firefly Pokémon^Illumise leads a flight of illuminated Volbeat to draw signs in the night sky. This Pokémon is said to earn greater respect from its peers by composing more complex…;Thorn Pokémon^Though beautiful, it has highly poisonous thorns. There is an old tradition in my homeland wherein one would send these thorns to an opponent to challenge them to a duel.;Stomach Pokémon^Most of Gulpin’s body is made up of its stomach—its heart and brain are very small in comparison. This Pokémon’s stomach contains special enzymes that dissolve anything.;Poison Bag Pokémon^Swalot has no teeth, so what it eats, it swallows whole, no matter what. Its cavernous mouth yawns widely. An automobile tire could easily fit inside this Pokémon’s…;Savage Pokémon^These Pokémon have sharp fangs and powerful jaws. Sailors avoid Carvanha dens at all costs.;Brutal Pokémon^This Pokémon is known as the Bully of the Sea. Any ship entering the waters Sharpedo calls home will be attacked—no exceptions.;Ball Whale Pokémon^When it sucks in a large volume of seawater, it becomes like a big, bouncy ball. It eats a ton of food daily.;Float Whale Pokémon^Its immense size is the reason for its popularity. Wailord watching is a favorite sightseeing activity in various parts of the world.;Numb Pokémon^Numel stores magma of almost 2,200 degrees Fahrenheit within its body. If it gets wet, the magma cools and hardens. In that event, the Pokémon’s body grows heavy and…;Eruption Pokémon^The humps on Camerupt’s back are formed by a transformation of its bones. They sometimes blast out molten magma. This Pokémon apparently erupts often when it is enraged.;Coal Pokémon^You find abandoned coal mines full of them. They dig tirelessly in search of coal.;Bounce Pokémon^Spoink keeps a pearl on top of its head. The pearl functions to amplify this Pokémon’s psychokinetic powers. It is therefore on a constant search for a bigger pearl.;Manipulate Pokémon^Grumpig uses the black pearls on its body to wield its fantastic powers. When it is doing so, it dances bizarrely. This Pokémon’s black pearls are valuable as works…;Spot Panda Pokémon^Each Spinda’s spot pattern is different. With its stumbling movements, it evades opponents’ attacks brilliantly!;Ant Pit Pokémon^It makes an inescapable conical pit and lies in wait at the bottom for prey to come tumbling down.;Vibration Pokémon^To help make its wings grow, it dissolves quantities of prey in its digestive juices and guzzles them down every day.;Mystic Pokémon^It is nicknamed the Desert Spirit because the flapping of its wings sounds like a woman singing.;Cactus Pokémon^The more arid and harsh the environment, the more pretty and fragrant a flower Cacnea grows. This Pokémon battles by wildly swinging its thorny arms.;Scarecrow Pokémon^If a traveler is going through a desert in the thick of night, Cacturne will follow in a ragtag group. The Pokémon are biding their time, waiting for the traveler to…;Cotton Bird Pokémon^Since Swablu looks like a cumulus cloud, foes can have a hard time finding it. Apparently its wings turned white over many generations.;Humming Pokémon^This Pokémon has a kind disposition, but if it’s provoked, it will threaten opponents with shrill cries before attacking them without mercy.;Cat Ferret Pokémon^Zangoose usually stays on all fours, but when angered, it gets up on its hind legs and extends its claws. This Pokémon shares a bitter rivalry with Seviper that dates…;Fang Snake Pokémon^Seviper’s swordlike tail serves two purposes—it slashes foes and douses them with secreted poison. This Pokémon will not give up its long-running blood feud with…;Meteorite Pokémon^It was discovered at the site of a meteor strike 40 years ago. Its stare can lull its foes to sleep.;Meteorite Pokémon^Solar energy is the source of its power, so it is strong during the daytime. When it spins, its body shines.;Whiskers Pokémon^Makes its home in swamps with murky water. The poor visibility hides this Pokémon from predators, and the slime on its body makes grasping it difficult.;Whiskers Pokémon^Strikes its caudal fin against the swamp bed to shake the ground and startle its prey. It will then swallow the fleeing prey whole. People mistook this behavior as…;Ruffian Pokémon^It was originally a Pokémon from afar that escaped to the wild. It can adapt to the dirtiest river.;Rogue Pokémon^A brutish Pokémon that loves to battle. It will crash itself into any foe that approaches its nest.;Clay Doll Pokémon^It was discovered in ancient ruins. While moving, it constantly spins. It stands on one foot even when asleep.;Clay Doll Pokémon^It appears to have been born from clay dolls made by ancient people. It uses telekinesis to float and move.;Sea Lily Pokémon^Lileep clings to rocks on the seabed. When prey comes close, this Pokémon entangles it with petallike tentacles.;Barnacle Pokémon^Once Cradily catches prey in its tentacles, it digests them whole and absorbs their nutrients.;Old Shrimp Pokémon^Anorith can swim swiftly by pulling its eight wings through the water like oars on a boat. This Pokémon is an ancestor of modern bug Pokémon.;Plate Pokémon^Though it lives on land, it’s also a good swimmer. It dives into the ocean in search of prey, using its sharp claws to take down its quarry.;Fish Pokémon^It is a shabby and ugly Pokémon. However, it is very hardy and can survive on little water.;Tender Pokémon^It’s said that a glimpse of a Milotic and its beauty will calm any hostile emotions you’re feeling.;Weather Pokémon^Its form changes depending on the weather. The rougher conditions get, the rougher Castform’s disposition!;Color Swap Pokémon^Its color changes for concealment and also when its mood or health changes. The darker the color, the healthier it is.;Puppet Pokémon^There’s a proverb that says, “Shun the house where Shuppet gather in the growing dusk.”;Marionette Pokémon^Resentment at being cast off made it spring into being. Some say that treating it well will satisfy it, and it will once more become a stuffed toy.;Requiem Pokémon^I've heard that the children of Hisui all begin to behave once they've been told the story of how this Pokémon roams about before the witching hour to spirit away…;Beckon Pokémon^There are rumors that peeking inside its bandage-wrapped body will cause one to get pulled in through the gaps between the bandages, never to return. I've been too…;Fruit Pokémon^Bunches of delicious fruit grow around its neck. In warm areas, many ranches raise Tropius.;Wind Chime Pokémon^Can emit waves of air powerful enough to knock out prey taller than itself. I hypothesize that it amplifies the faint sound of wind within its body.;Disaster Pokémon^Because of this Pokémon’s ability to detect danger, people mistook Absol as a bringer of doom.;Bright Pokémon^It tends to move in a pack with others. They cluster in a tight group to sleep in a cave.;Snow Hat Pokémon^Arrives alongside the first snow. It's thought that homes Snorunt visit will prosper for many generations. By tradition, one might offer a lump of ice made from pure…;Face Pokémon^It covers its body with an armor of ice harder than steel. Uses its breath to freeze prey, which it then devours as if they were frozen desserts.;Clap Pokémon^During the season when drift ice approaches the shore, Spheal prefers living on the ice—where fewer predators lurk—rather than the land. Its fur retains heat superbly…;Ball Roll Pokémon^Its white whiskers are very sensitive. Sealeo will balance Spheal on the tip of its nose, checking its scent and its feel to be sure the Spheal is healthy.;Ice Break Pokémon^Its thick tusks are strong enough to shatter drift ice. They have been known to break, but they will grow back by the next year. The Hisui region is well known for…;Bivalve Pokémon^Clamperl’s pearls are exceedingly precious. They can be more than 10 times as costly as Shellder’s pearls.;Deep Sea Pokémon^Deep seas are their habitat. According to tradition, when Huntail wash up onshore, something unfortunate will happen.;South Sea Pokémon^It sucks bodily fluids out of its prey. The leftover meat sinks to the seafloor, where it becomes food for other Pokémon.;Longevity Pokémon^This Pokémon was discovered during deep-sea exploration. Its appearance hasn’t changed in 100,000,000 years, so it’s called a living fossil.;Rendezvous Pokémon^Luvdisc makes its home in coral reefs in warm seas. It especially likes sleeping in the space between Corsola’s branches.;Rock Head Pokémon^Bagon is a solitary Pokémon that doesn’t form groups with others of its kind. It also has a head hard enough to cleave a boulder in one strike.;Endurance Pokémon^Shelgon ignores its hunger entirely, never eating any food. Apparently, Shelgon will evolve once all its energy stores are used up.;Dragon Pokémon^While basking in the joy of flight generally keeps this Pokémon in high spirits, Salamence turns into an uncontrollable menace if something angers it.;Iron Ball Pokémon^The cells in this Pokémon’s body are composed of magnetic material. Instead of blood, magnetic forces flow through Beldum’s body.;Iron Claw Pokémon^Using magnetic forces to stay aloft, this Pokémon flies at high speeds, weaving through harsh mountain terrain in pursuit of prey.;Iron Leg Pokémon^Metagross is the result of the fusion of two Metang. This Pokémon defeats its opponents through use of its supercomputer-level brain.;Rock Peak Pokémon^Cutting-edge technology was used to study the internals of this Pokémon’s rock body, but nothing was found—not even a brain or a heart.;Iceberg Pokémon^This Pokémon’s body is made of solid ice. It’s said that Regice was born beneath thick ice in the ice age.;Iron Pokémon^It’s rumored that this Pokémon was born deep underground in the planet’s mantle and that it emerged onto the surface 10,000 years ago.;Eon Pokémon^Latias is highly intelligent and capable of understanding human speech. It is covered with a glass-like down. The Pokémon enfolds its body with its down and refracts…;Eon Pokémon^Latios will only open its heart to a Trainer with a compassionate spirit. This Pokémon can fly faster than a jet plane by folding its forelegs to minimize air resistance.;Sea Basin Pokémon^Kyogre is said to be the personification of the sea itself. Legends tell of its many clashes against Groudon, as each sought to gain the power of nature.;Continent Pokémon^Through Primal Reversion and with nature’s full power, it will take back its true form. It can cause magma to erupt and expand the landmass of the world.;Sky High Pokémon^It flies forever through the ozone layer, consuming meteoroids for sustenance. The many meteoroids in its body provide the energy it needs to Mega Evolve.;Wish Pokémon^It’s believed that when this Pokémon wakes from its 1,000-year slumber, it will grant any wishes written on the notes attached to its head.;DNA Pokémon^Deoxys emerged from a virus that came from space. It is highly intelligent and wields psychokinetic powers. This Pokémon shoots lasers from the crystalline organ on…;Tiny Leaf Pokémon^This Pokémon becomes more energetic the more sunlight there is. The part resembling a shell is similar to silt and is slightly damp and warm to the touch.;Grove Pokémon^Appears where there is clean spring water. The fruit that grows on the shrubs on its shell is sweet, nutritious, and truly delicious.;Continent Pokémon^This remarkable, large-bodied Pokémon would serve beautifully as borrowed scenery for a garden, and its strength is peerless. Torterra roams the wilderness in search…;Chimp Pokémon^Full of vigor and always in high spirits. It was once known by the name ”Lantern-Tail” and feared as some kind of apparition.;Playful Pokémon^The deeper the blue on its face, the more powerful it will grow to become. It leaps about every which way and lands powerful blows against its opponents with the…;Flame Pokémon^A tall, hardy Pokémon with a dazzling appearance. It shrouds itself in flame and battles as if engaged in dance—truly a sight to behold.;Penguin Pokémon^Prefers cold climes and appears along coasts. It's an adorable little thing—as cute as any child—but it's also prideful, unwilling to accept handouts from people.;Penguin Pokémon^It swims gracefully through the frigid sea and sings with a voice like the roaring tide. It has powerful, sturdy wings and dignity to match.;Emperor Pokémon^Since ancient times, it has been revered by the people of Hisui, who call it the Master of the Waves. Its wings are a match for even master-crafted blades.;Starling Pokémon^They live in the fields and mountains, gathering in large flocks. Their cries are quite obnoxious. Though small, their wings are strong—a strike from them leaves pain…;Starling Pokémon^They form remarkably large flocks and are constantly fighting amongst themselves. I suspect that those with magnificent plumes on their heads are the strong ones.;Predator Pokémon^It has left the flock, having gained strength enough to survive on its own. The astounding force with which Staraptor flies through the air allows it to carry away…;Plump Mouse Pokémon^Bidoof has an unsophisticated face and is rarely flustered by anything. There have been incidents involving Bidoof sauntering into villages and gnawing on the houses…;Beaver Pokémon^Bibarel fur repels water and is also a fantastic material for heat retention. These Pokémon create dams on rivers to live in.;Cricket Pokémon^When the trees take on new hues, more of these Pokémon appear. The tone they create by striking their antennae together resembles that of the marimba, an instrument…;Cricket Pokémon^It uses its cutlass-like arms to produce sound, the melody of which varies from individual to individual. It is a worthwhile endeavor to seek out one's favorite tunes.;Flash Pokémon^Shakes its body to generate electricity. Its stature belies its aggression—one must be patient to tame this Pokémon.;Spark Pokémon^Proudly uses its electrified claws as weapons. It seems to be a gracious Pokémon, evenly sharing the spoils of the hunt with others of its kind.;Gleam Eyes Pokémon^They form packs, each having one male as leader. Legends say that when Luxray's two eyes shimmer with gold, the Pokémon can see through anything.;Bud Pokémon^When the sun's light strengthens, the bud atop this Pokémon's head opens. This is a sign to the people that the harsh winter is over, and the season of budding has begun.;Bouquet Pokémon^Hidden within the bouquet on each hand are thorned whips loaded with virulent poison. Roserade moves gracefully as it corners its prey and mercilessly lashes them…;Head Butt Pokémon^An incredibly rare sight. They duel each other by ramming their heads together, and the resulting sound echoes throughout the area like the pealing of a bell.;Head Butt Pokémon^Very little is known about its biology. Can knock down massive trees by smashing its beautiful, pearl-like crown against them.;Shield Pokémon^Much remains unknown about this Pokémon, as few have ever seen it. However, we know that it is calm and dislikes conflict, and it enjoys polishing its face against…;Shield Pokémon^Its face is sturdy—as strong as diamond—and this hardness offers a very stable defense. Much about this species is still unknown, such as its natural habitat.;Bagworm Pokémon^If its cloak is even slightly damaged, Burmy will immediately repair it with whatever is close at hand. The Pokémon within the cloak is scrawny and vulnerable to the…;Bagworm Pokémon^When Burmy evolved, its cloak became a part of this Pokémon’s body. The cloak is never shed.;Moth Pokémon^Scatters steel-colored scales as it flaps its wings. Despite being observed feeding primarily on the nectar of flowers, Mothim is not often seen around flower gardens.;Tiny Bee Pokémon^They swear fealty to a queen Pokémon and work diligently to gather nectar. Each swarm produces a different flavor of honey.;Beehive Pokémon^Commands its subjects to build its hive. It will dispatch any interlopers who dare sneak into its nest and use them as nourishment for itself.;EleSquirrel Pokémon^A species related to the Pikachu line. Though Pachirisu is a calm Pokémon, it still presents a danger should one touch its electrified tail or cheeks.;Sea Weasel Pokémon^It moves freely in the water by spinning its forked tail for propulsion. The resemblance to the screw of a steamboat is coincidental.;Sea Weasel Pokémon^Has a long, rather splendid flotation sac, which prevents Floatzel from drowning even in stormy seas. One might glimpse this species around fishing hamlets from time…;Cherry Pokémon^Once the fruit growing alongside the main body is large and plump, Cherubi will use the nutrients within to evolve. The fruit then detaches, becoming nourishment for…;Blossom Pokémon^Motionless, save for the occasional quiver. A rich array of Pokémon can be found gathered around it, drawn by the scent exuded from Cherrim's folded petals.;Sea Slug Pokémon^Found in abundance on seashores bordering warm waters. Shellos are unexpectedly friendly and will crawl toward any person they see. Take care not to get coated in mucus!;Sea Slug Pokémon^Eats beach sand for nourishment. Should one Gastrodon encounter another of a different color, a fierce battle will inevitably ensue.;Long Tail Pokémon^To affirm their kinship, members of this species will form a ring by linking their newly doubled tails together. On rare occasions, humans have been accepted into…;Balloon Pokémon^Said to lure away young children and carry them off to the afterlife. Some whisper that Drifloon are formed of reincarnated human souls, but these rumors are as yet…;Blimp Pokémon^It drifts along at dusk, perfectly silent. Its transient, melancholy aspect touches some people deeply—every so often, one will come upon a song or poem devoted to…;Rabbit Pokémon^My hypothesis as to why Buneary rolls up its ears is that its hearing is far too keen. I surmise that the Pokémon protects its hearing by limiting the sound that may…;Rabbit Pokémon^Its fur is warm and yet remarkably light. This Pokémon kicks as though it were a master of karate, driving back its opponents with ease.;Magical Pokémon^The incantations Mismagius chants can ward against misfortune, so a custom exists of inviting it into one's home. Incur the Pokémon's displeasure, however, and…;Big Boss Pokémon^One cry from this Pokémon, and a murder of Murkrow come flying. At such times, one would think the curtain of night had fallen, plunging the world into jet-black…;Catty Pokémon^Bewitches humans with its helical tail and piercing gaze. Its hidden claws are quite sharp as well, making this Pokémon an exceedingly tricky opponent if antagonized.;Tiger Cat Pokémon^Though impudent and difficult to tame, Purugly enjoys great popularity due to its fur, the beauty of which surpasses even velveteen.;Bell Pokémon^This Pokémon gave me an excruciating headache when it seemingly cried out without making a sound. Perhaps there are some sounds that the human ear is simply incapable…;Skunk Pokémon^The poison that gushes from its aft end is accompanied by an utterly evil-smelling odor with such potency that one whiff can induce memory loss.;Skunk Pokémon^Sprays a poisonous fluid to take down prey. Sometimes, unable to stomach the stench of its own fluid, it leaves the bested prey uneaten.;Bronze Pokémon^Floats using a mysterious energy. The pattern engraved upon its back is held as sacred and can sometimes be found in imagery from ancient cemeteries and other such…;Bronze Bell Pokémon^Some believe that its bell-like cry opens holes to another world. It has been revered as a deity since ancient times.;Bonsai Pokémon^Its tears elicit sympathy from those who see them, but do not be deceived! This expulsion of body water is merely a physiological mechanism for keeping itself in good…;Mime Pokémon^Known to turn up in bustling marketplaces now and again. It mimics people much as a child would, then watches how they react, eyes sparkling.;Playhouse Pokémon^In imitation of Chansey, it keeps a round stone tucked into its belly pouch and cherishes it dearly. It gets along well with children and will sometimes play house…;Music Note Pokémon^A versatile performer skilled in the imitation of human speech. It is said that older, more experienced Chatot can even understand the meaning of the words they mimic.;Forbidden Pokémon^It lays curses by thinking wicked thoughts. Writings tell that this Pokémon was born out of the assembly of five score and eight malevolent spirits.;Land Shark Pokémon^It nests in caves untouched by sunlight. Its sharp teeth may fall out when worn away or after an impact, but they regrow within a few days.;Cave Pokémon^Though Gabite are usually of a violent disposition, when I gave one a glass bead it had been eyeing covetously, it suddenly became quite docile.;Mach Pokémon^Soars across the heavens at blinding speed—a magnificent sight! It has a feral disposition. Utmost caution is required if one meets a Garchomp out in the wilds.;Big Eater Pokémon^Its robust stomach allows it to nonchalantly devour even rotted matter. It pays frequent visits to villages, seeking out food scraps intended for compost.;Emanation Pokémon^Though infantile in appearance, it has the mysterious ability to read the minds of humans. The pure of heart are met with Riolu's approval, while those of ill nature…;Aura Pokémon^A most gallant-looking creature. It emits energy waves and controls them with precision, using them to sense even faraway beings. I have given the name ”aura” to this…;Hippo Pokémon^Though large and languid, Hippopotas is difficult to detect due to its tendency to burrow into and lurk beneath the soil. When agitated or excited, it expels sand…;Heavyweight Pokémon^Short-tempered and easily moved to violence. It whips up whirlwinds of sand to crush its foes' spirits, then goes in for the attack.;Scorpion Pokémon^Its claws are not only razor-sharp but poisonous, making Skorupi a highly dangerous Pokémon. It seems to be weakened by cold temperatures, however.;Ogre Scorpion Pokémon^Has a brutish, ferocious temperament. With immense strength and a sturdy shell off which swords will bounce, it rampages about and wreaks havoc.;Toxic Mouth Pokémon^A poison wielder with a dastardly personality. Despite such qualities, this species is afforded a measure of popularity due to its peculiar cry and comical features.;Toxic Mouth Pokémon^Its crimson claws contain a virulent toxin. This toxin can be made into a tonic by diluting it, mixing it with several types of wild grass, and boiling it down over…;Bug Catcher Pokémon^Though this is a plant Pokémon, it has a gluttonous and unruly temperament. Carnivine attacks its prey with its cavernous maw wide open.;Wing Fish Pokémon^What a gorgeous sight this Pokémon is as it swims with its long, pink-painted caudal fins fluttering behind it. Finneon's beautiful appearance has led to its…;Neon Pokémon^Uses its gleaming fins to hunt its prey. The view of Lumineon schooling near the surface of the sea at night is breathtaking— it's as though there were shining stars…;Kite Pokémon^Though ball-like in shape, this Pokémon is a proficient swimmer. I have discovered that if a Mantyke spends much time with schools of Remoraid, it will eventually…;Frost Tree Pokémon^One is likely to encounter this Pokémon while out in the snow. There are stories of Snover appearing in human settlements but doing no harm—rather, they bond with the…;Frost Tree Pokémon^A powerful Pokémon that can split huge boulders with ease. Dislikes associating with others and chooses to live quietly deep within the mountains, playing with the snow.;Sharp Claw Pokémon^This species corners prey as a pack, under the guidance of a leader. Weavile displays increased cunning, leading me to speculate that its evolution caused further…;Magnet Area Pokémon^I theorize that a special magnetic field influenced this Pokémon, changing its molecular structure and causing it to evolve. It emits strange radio waves toward space…;Licking Pokémon^Its tongue can extend and contract freely, and it is capable of reaching lengths over 10 times Lickilicky's height. Beware of the saliva, as it contains corrosive…;Drill Pokémon^This Pokémon evolved through use of a curious item. Its rocklike hide is composed of a mysterious substance and can withstand a blow from a masterwork sword with nary…;Vine Pokémon^Draped with long vines, it resembles a shrub in appearance. It swings bundles of vines as though they were arms, wrapping them around prey to ensnare them.;Thunderbolt Pokémon^Its evolution was induced by an unusual item, and its electrical output rises along with its heart rate. From its tails, it can unleash an electric current measuring…;Blast Pokémon^Use of a strange item caused this Pokémon to evolve. Fireballs launched from the ends of its tubelike arms are hot enough to melt an iron pot in an instant.;Jubilee Pokémon^Scant few have ever sighted this Pokémon. After studying what literature remains, I am certain Togekiss will reveal itself when peace reigns in the land.;Ogre Darner Pokémon^Extremely violent. When hunting, it wastes none of its energy, aiming only for prey's most vulnerable spots. Any who manage to tame this Pokémon must be of incredible…;Verdant Pokémon^Cells similar to those of plants have been found in its fur. Its hard tail can fell a large tree with one stroke, and the tail's sharpness exceeds even that of a…;Fresh Snow Pokémon^Glaceon is able to lower its body temperature very quickly. It freezes the atmosphere, creating diamond dust that glitters like gems while it flutters and dances around.;Fang Scorpion Pokémon^It glides soundlessly on pitch-black wings and sinks sharp fangs into the throat of its prey. It takes on a look of satisfaction once it has entirely drained its prey…;Twin Tusk Pokémon^This species reached its zenith during the period known as the ice age. I suspect that Hisui's frigid climate is in harmony with Mamoswine's constitution, thus…;Virtual Pokémon^A curious item induced this evolution. The Pokémon's offensive capabilities have greatly increased, but the strangeness of its behavior has magnified in equal…;Blade Pokémon^The blades extending from its elbows are sharper than the finest swords. Its swordsmanship, albeit self-taught, is astonishingly impressive.;Compass Pokémon^It is able to emit powerful magnetism, allowing it control over the iron sand that forms its luscious mustache. Using this iron sand, Probopass forms hard stones with…;Gripper Pokémon^Comes to those whose lives have come to an end and escorts their souls to the afterlife. Known to mistakenly take the souls of those who yet have life left in them,…;Snow Land Pokémon^A Pokémon inhabited by the soul of a woman who died bearing a grudge in the snowy mountains. Legends of Froslass placing deathly curses on misbehaving men send…;Plasma Pokémon^This bizarre Pokémon appears to be a will-o'-the-wisp powered by electricity. Be wary, as Rotom is both smart and mischievous.;Knowledge Pokémon^A Pokémon feared but also respected for stealing away the memories of evildoers. I have found records that suggest Uxie holds dominion over knowledge.;Emotion Pokémon^Known as the Being of Emotion. In legend, this Pokémon was feared, as any who showed disrespect would have their emotions thrown into disarray.;Willpower Pokémon^The dreaded Being of Willpower. Legends tell of this Pokémon manipulating the will of its adversaries and turning them into puppets of its own.;Temporal Pokémon^This Pokémon is revered as a deity in Hisuian legend. The birth of Dialga was what caused the vast river of time to begin flowing in our world.;Spatial Pokémon^This Pokémon is feared as a deity in Hisuian legend. The birth of Palkia was what caused the walls of our world to disappear, creating a sky that spans for infinity.;Lava Dome Pokémon^Stories tell of this Pokémon being birthed from the boiling magma within Mount Coronet. Its molten-steel body holds many mysteries.;Colossal Pokémon^According to legend, Regigigas pulled landmasses together and bound them with rope to create the continent of Hisui. Though I have my doubts, the story could well…;Renegade Pokémon^There is one Hisuian verse that tells of a powerful light creating a deep shadow. I imagine that this deep shadow is Giratina.;Lunar Pokémon^Cresselia is reminiscent of the crescent moon. It leaves a brilliant line of light in its wake as it flies across the night sky. I daresay it resembles the heavenly…;Sea Drifter Pokémon^Can be seen floating offshore during seasons when the seas are warm. Its azure body blends in with the ocean waters—logic suggests this is a defense mechanism against…;Seafaring Pokémon^Rumored to migrate across the oceans and visit Hisui's coastal waters only rarely. Although Manaphy resembles Phione, it is also quite different. The relation between…;Pitch-Black Pokémon^On a moonless night, a strange incident occurred in which every one of a village's inhabitants suffered nightmares. The villagers attested that Darkrai appeared…;Gratitude Pokémon^When the turning of seasons brings the cruel winter to its end and the joyous people give thanks to the heavens, Shaymin appears and covers the withered land with…;Alpha Pokémon^It is the heavenly fount from which pours the light that shines across Hisui. Its luminance guides and protects all Pokémon. Hisuian mythology states that Arceus is…;Victory Pokémon^When it shares the infinite energy it creates, that being’s entire body will be overflowing with power.;Grass Snake Pokémon^They photosynthesize by bathing their tails in sunlight. When they are not feeling well, their tails droop.;Grass Snake Pokémon^When it gets dirty, its leaves can’t be used in photosynthesis, so it always keeps itself clean.;Regal Pokémon^It can stop its opponents’ movements with just a glare. It takes in solar energy and boosts it internally.;Fire Pig Pokémon^It loves to eat roasted berries, but sometimes it gets too excited and burns them to a crisp.;Fire Pig Pokémon^When its internal fire flares up, its movements grow sharper and faster. When in trouble, it emits smoke.;Mega Fire Pig Pokémon^It has mastered fast and powerful fighting moves. It grows a beard of fire.;Sea Otter Pokémon^This Pokémon from the Unova region uses the shell on its belly as a weapon to cut down its foes. Thus, I've conferred upon this shell the name ”scalchop”.;Discipline Pokémon^Its exquisite double-scalchop technique is likely the result of daily training, and it can send even masters of the blade fleeing in defeat.;Formidable Pokémon^Hard of heart and deft of blade, this rare form of Samurott is a product of the Pokémon's evolution in the region of Hisui. Its turbulent blows crash into foes like…;Scout Pokémon^Extremely cautious, one of them will always be on the lookout, but it won’t notice a foe coming from behind.;Lookout Pokémon^When they see an enemy, their tails stand high, and they spit the seeds of berries stored in their cheek pouches.;Puppy Pokémon^This Pokémon is far brighter than the average child, and Lillipup won’t forget the love it receives or any abuse it suffers.;Loyal Dog Pokémon^The black fur that covers this Pokémon’s body is dense and springy. Even sharp fangs bounce right off.;Big-Hearted Pokémon^Stoutland is immensely proud of its impressive moustache. It’s said that moustache length is what determines social standing among this species.;Devious Pokémon^Opponents that get drawn in by its adorable behavior come away with stinging scratches from its claws and stinging pride from its laughter.;Cruel Pokémon^This stealthy Pokémon sneaks up behind prey without making any sound at all. It competes with Thievul for territory.;Grass Monkey Pokémon^It’s good at finding berries and gathers them from all over. It’s kind enough to share them with friends.;Thorn Monkey Pokémon^Ill tempered, it fights by swinging its barbed tail around wildly. The leaf growing on its head is very bitter.;High Temp Pokémon^This Pokémon lives in caves in volcanoes. The fire within the tuft on its head can reach 600 degrees Fahrenheit.;Ember Pokémon^When it gets excited, embers rise from its head and tail and it gets hot. For some reason, it loves sweets.;Spray Pokémon^The water stored inside the tuft on its head is full of nutrients. Plants that receive its water grow large.;Geyser Pokémon^It prefers places with clean water. When its tuft runs low, it replenishes it by siphoning up water with its tail.;Dream Eater Pokémon^It eats dreams and releases mist. The mist is pink when it’s eating a good dream, and black when it’s eating a nightmare.;Drowsing Pokémon^It drowses and dreams all the time. It’s best to leave it be if it’s just woken up, as it’s a terrible grump when freshly roused from sleep.;Tiny Pigeon Pokémon^It’s forgetful and not very bright, but many Trainers love it anyway for its friendliness and sincerity.;Wild Pigeon Pokémon^These bright Pokémon have acute memories. Apparently delivery workers often choose them as their partners.;Proud Pokémon^This Pokémon is intelligent and intensely proud. People will sit up and take notice if you become the Trainer of one.;Electrified Pokémon^Its mane shines when it discharges electricity. They use the frequency and rhythm of these flashes to communicate.;Thunderbolt Pokémon^They have lightning-like movements. When Zebstrika run at full speed, the sound of thunder reverberates.;Mantle Pokémon^When it detects a noise, it starts to move. The energy core inside it makes this Pokémon slightly warm to the touch.;Ore Pokémon^It relies on sound in order to monitor what’s in its vicinity. When angered, it will attack without ever changing the direction it’s facing.;Compressed Pokémon^Although its energy blasts can blow away a dump truck, they have a limitation— they can only be fired when the sun is out.;Bat Pokémon^It emits ultrasonic waves as it flutters about, searching for its prey—bug Pokémon.;Courting Pokémon^The auspicious shape of this Pokémon’s nose apparently led some regions to consider Swoobat a symbol of good luck.;Mole Pokémon^It’s a digger, using its claws to burrow through the ground. It causes damage to vegetable crops, so many farmers have little love for it.;Subterrene Pokémon^Known as the Drill King, this Pokémon can tunnel through the terrain at speeds of over 90 mph.;Hearing Pokémon^This Pokémon has a kind heart. By touching with its feelers, Audino can gauge other creatures’ feelings and physical conditions.;Muscular Pokémon^Timburr that have started carrying logs that are about three times their size are nearly ready to evolve.;Muscular Pokémon^Gurdurr excels at demolition—construction is not its forte. In any case, there’s skill in the way this Pokémon wields its metal beam.;Muscular Pokémon^When going all out, this Pokémon throws aside its concrete pillars and leaps at opponents to pummel them with its fists.;Tadpole Pokémon^It uses sound waves to communicate with others of its kind. People and other Pokémon species can’t hear its cries of warning.;Vibration Pokémon^On occasion, their cries are sublimely pleasing to the ear. Palpitoad with larger lumps on their bodies can sing with a wider range of sounds.;Vibration Pokémon^This Pokémon is popular among the elderly, who say the vibrations of its lumps are great for massages.;Judo Pokémon^They train in groups of five. Any member that can’t keep up will discard its belt and leave the group.;Karate Pokémon^The karate chops of a Sawk that’s trained itself to the limit can cleave the ocean itself.;Sewing Pokémon^Since this Pokémon makes its own clothes out of leaves, it is a popular mascot for fashion designers.;Leaf-Wrapped Pokémon^It protects itself from the cold by wrapping up in leaves. It stays on the move, eating leaves in forests.;Nurturing Pokémon^It keeps its eggs warm with heat from fermenting leaves. It also uses leaves to make warm wrappings for Sewaddle.;Centipede Pokémon^Its fangs are highly venomous. If this Pokémon finds prey it thinks it can eat, it leaps for them without any thought of how things might turn out.;Curlipede Pokémon^Whirlipede protects itself with a sturdy shell and poisonous spikes while it stores up the energy it’ll need for evolution.;Megapede Pokémon^Scolipede engage in fierce territorial battles with Centiskorch. At the end of one of these battles, the victor makes a meal of the loser.;Cotton Puff Pokémon^Weaving together the cotton of both Cottonee and Eldegoss produces exquisite cloth that’s highly prized by many luxury brands.;Windveiled Pokémon^As long as this Pokémon bathes in sunlight, its cotton keeps growing. If too much cotton fluff builds up, Whimsicott tears it off and scatters it.;Bulb Pokémon^The leaves on its head are highly valued for medicinal purposes. Dry the leaves in the sun, boil them, and then drink the bitter decoction for remarkably effective…;Flowering Pokémon^I suspect that its well-developed legs are the result of a life spent on mountains covered in deep snow. The scent it exudes from its flower crown heartens those in…;Hostile Pokémon^Though it differs from other Basculin in several respects, including demeanor—this one is gentle—I have categorized it as a regional form given the vast array of…;Desert Croc Pokémon^Sandile is small, but its legs and lower body are powerful. Pushing sand aside as it goes, Sandile moves through the desert as if it’s swimming.;Desert Croc Pokémon^Although this Pokémon has specialized eyes that allow it to see in the dark, Krokorok won’t move much at night—the desert gets cold after sunset.;Intimidation Pokémon^While terribly aggressive, Krookodile also has the patience to stay hidden under sand for days, lying in wait for prey.;Zen Charm Pokémon^This popular symbol of good fortune will never fall over in its sleep, no matter how it’s pushed or pulled.;Blazing Pokémon^This Pokémon’s power level rises along with the temperature of its fire, which can reach 2,500 degrees Fahrenheit.;Cactus Pokémon^Once each year, this Pokémon scatters its seeds. They’re jam-packed with nutrients, making them a precious food source out in the desert.;Rock Inn Pokémon^It first tries to find a rock to live in, but if there are no suitable rocks to be found, Dwebble may move in to the ports of a Hippowdon.;Stone Home Pokémon^Its thick claws are its greatest weapons. They’re mighty enough to crack Rhyperior’s carapace.;Shedding Pokémon^It protects itself with its durable skin. It’s thought that this Pokémon will evolve once its skin has completely stretched out.;Hoodlum Pokémon^While mostly known for having the temperament of an aggressive ruffian, this Pokémon takes very good care of its family, friends, and territory.;Avianoid Pokémon^A discovery was made in the desert where Sigilyph fly. The ruins of what may have been an ancient city were found beneath the sands.;Spirit Pokémon^The spirit of a person from a bygone age became this Pokémon. It rambles through ruins, searching for someone who knows its face.;Coffin Pokémon^There are many depictions of Cofagrigus decorating ancient tombs. They’re symbols of the wealth that kings of bygone eras had.;Prototurtle Pokémon^Tirtouga is considered to be the ancestor of many turtle Pokémon. It was restored to life from a fossil.;Prototurtle Pokémon^This Pokémon emerges from the water in search of prey despite the fact that it moves more slowly on land.;First Bird Pokémon^Archen is said to be the ancestor of bird Pokémon. It lived in treetops, eating berries and bug Pokémon.;First Bird Pokémon^Though capable of flight, Archeops was apparently better at hunting on the ground.;Trash Bag Pokémon^This Pokémon was born from a bag stuffed with trash. Galarian Weezing relish the fumes belched by Trubbish.;Trash Heap Pokémon^The toxic liquid it launches from its right arm is so virulent that it can kill a weakened creature instantly.;Tricky Fox Pokémon^A once-departed soul, returned to life in Hisui. Derives power from resentment, which rises as energy atop its head and takes on the forms of foes. In this way, Zorua…;Illusion Fox Pokémon^With its disheveled white fur, it looks like an embodiment of death. Heedless of its own safety, Zoroark attacks its nemeses with a bitter energy so intense, it…;Chinchilla Pokémon^They pet each other with their tails as a form of greeting. Of the two, the one whose tail is fluffier is a bit more boastful.;Scarf Pokémon^A special oil that seeps through their fur helps them avoid attacks. The oil fetches a high price at market.;Fixation Pokémon^Even when nobody seems to be around, Gothita can still be heard making a muted cry. Many believe it’s speaking to something only it can see.;Manipulate Pokémon^On nights when the stars shine, this Pokémon’s psychic power is at its strongest. It’s unknown just what link Gothorita has to the greater universe.;Astral Body Pokémon^A criminal who was shown his fate by a Gothitelle went missing that same day and was never seen again.;Cell Pokémon^Many say that the special liquid covering this Pokémon’s body would allow it to survive in the vacuum of space.;Mitosis Pokémon^Its brain has split into two, and the two halves rarely think alike. Its actions are utterly unpredictable.;Multiplying Pokémon^It’s said that drinking the liquid surrounding Reuniclus grants wisdom. Problem is, the liquid is highly toxic to anything besides Reuniclus itself.;Water Bird Pokémon^They are better at swimming than flying, and they happily eat their favorite food, peat moss, as they dive underwater.;White Bird Pokémon^Swanna start to dance at dusk. The one dancing in the middle is the leader of the flock.;Fresh Snow Pokémon^Supposedly, this Pokémon was born from an icicle. It spews out freezing air at −58 degrees Fahrenheit to make itself more comfortable.;Icy Snow Pokémon^It blasts enemies with cold air reaching −148 degrees Fahrenheit, freezing them solid. But it spares their lives afterward—it’s a kind Pokémon.;Snowstorm Pokémon^People believe this Pokémon formed when two Vanillish stuck together. Its body temperature is roughly 21 degrees Fahrenheit.;Season Pokémon^The turning of the seasons changes the color and scent of this Pokémon’s fur. People use it to mark the seasons.;Season Pokémon^They migrate according to the seasons, so some people call Sawsbuck the harbingers of spring.;Sky Squirrel Pokémon^This Pokémon absolutely loves sweet berries. Sometimes it stuffs its cheeks full of so much food that it can’t fly properly.;Clamping Pokémon^It spits a liquid from its mouth to melt through Shelmet’s shell. Karrablast doesn’t eat the shell— it eats only the contents.;Cavalry Pokémon^It charges its enemies, lances at the ready. An image of one of its duels is captured in a famous painting of Escavalier clashing with Sirfetch’d.;Mushroom Pokémon^The spores released from this Pokémon’s hands are highly poisonous, but when thoroughly dried, the spores can be used as stomach medicine.;Mushroom Pokémon^Amoonguss generally doesn’t move much. It tends to stand still near Poké Balls that have been dropped on the ground.;Floating Pokémon^Legend has it that the residents of a sunken ancient city changed into these Pokémon.;Floating Pokémon^Whenever a full moon hangs in the night sky, schools of Jellicent gather near the surface of the sea, waiting for their prey to appear.;Caring Pokémon^The reason it helps Pokémon in a weakened condition is that any Pokémon coming after them may also attack Alomomola.;Attaching Pokémon^Joltik latch on to other Pokémon and suck out static electricity. They’re often found sticking to Yamper’s hindquarters.;EleSpider Pokémon^It lays traps of electrified threads near the nests of bird Pokémon, aiming to snare chicks that are not yet good at flying.;Thorn Seed Pokémon^Mossy caves are their preferred dwellings. Enzymes contained in mosses help Ferroseed’s spikes grow big and strong.;Thorn Pod Pokémon^Its spikes are harder than steel. This Pokémon crawls across rock walls by stabbing the spikes on its feelers into the stone.;Gear Pokémon^It’s suspected that Klink were the inspiration behind ancient people’s invention of the first gears.;Gear Pokémon^Many companies in the Galar region choose Klang as their logo. This Pokémon is considered the symbol of industrial technology.;Gear Pokémon^The three gears that compose this Pokémon spin at high speed. Its new spiked gear isn’t a living creature.;EleFish Pokémon^One alone can emit only a trickle of electricity, so a group of them gathers to unleash a powerful electric shock.;EleFish Pokémon^These Pokémon have a big appetite. When they spot their prey, they attack it and paralyze it with electricity.;EleFish Pokémon^They crawl out of the ocean using their arms. They will attack prey on shore and immediately drag it into the ocean.;Cerebral Pokémon^This Pokémon was discovered about 50 years ago. Its highly developed brain enables it to exert its psychic powers.;Cerebral Pokémon^Sometimes found drifting above wheat fields, this Pokémon can control the memories of its opponents.;Candle Pokémon^The younger the life this Pokémon absorbs, the brighter and eerier the flame on its head burns.;Lamp Pokémon^It lurks in cities, pretending to be a lamp. Once it finds someone whose death is near, it will trail quietly after them.;Luring Pokémon^In homes illuminated by Chandelure instead of lights, funerals were a constant occurrence— or so it’s said.;Tusk Pokémon^They play with each other by knocking their large tusks together. Their tusks break sometimes, but they grow back so quickly that it isn’t a concern.;Axe Jaw Pokémon^Its skin is as hard as a suit of armor. Fraxure’s favorite strategy is to tackle its opponents, stabbing them with its tusks at the same time.;Axe Jaw Pokémon^While usually kindhearted, it can be terrifying if angered. Tusks that can slice through steel beams are how Haxorus deals with its adversaries.;Chill Pokémon^It sniffles before performing a move, using its frosty snot to provide an icy element to any move that needs it.;Freezing Pokémon^It swims energetically through frigid seas. When it gets tired, it freezes the seawater with its breath so it can rest on the ice.;Crystallizing Pokémon^When the weather gets hot, these Pokémon turn into water vapor. Cryogonal are almost never seen during summer.;Snail Pokémon^It has a strange physiology that responds to electricity. When together with Karrablast, Shelmet evolves for some reason.;Shell Out Pokémon^Discarding its shell made it nimble. To keep itself from dehydrating, it wraps its body in bands of membrane.;Trap Pokémon^For some reason, this Pokémon smiles slightly when it emits a strong electric current from the yellow markings on its body.;Martial Arts Pokémon^Though small, Mienfoo’s temperament is fierce. Any creature that approaches Mienfoo carelessly will be greeted with a flurry of graceful attacks.;Martial Arts Pokémon^Delivered at blinding speeds, kicks from this Pokémon can shatter massive boulders into tiny pieces.;Cave Pokémon^Druddigon are vicious and cunning. They take up residence in nests dug out by other Pokémon, treating the stolen nests as their own lairs.;Automaton Pokémon^This Pokémon was created from clay. It received orders from its master many thousands of years ago, and it still follows those orders to this day.;Automaton Pokémon^There’s a theory that inside Golurk is a perpetual motion machine that produces limitless energy, but this belief hasn’t been proven.;Sharp Blade Pokémon^A pack of these Pokémon forms to serve a Bisharp boss. Each Pawniard trains diligently, dreaming of one day taking the lead.;Sword Blade Pokémon^Violent conflicts erupt between Bisharp and Fraxure over places where sharpening stones can be found.;Bash Buffalo Pokémon^These Pokémon live in herds of about 20 individuals. Bouffalant that betray the herd will lose the hair on their heads for some reason.;Eaglet Pokémon^Its chick-like looks belie its hotheadedness. It challenges its parents at every opportunity, desperate to prove its strength.;Valiant Pokémon^Screaming a bloodcurdling battle cry, this huge and ferocious bird Pokémon goes out on the hunt. It blasts lakes with shock waves, then scoops up any prey that float…;Diapered Pokémon^Vullaby grow quickly. Bones that have gotten too small for older Vullaby to wear often get passed down to younger ones in the nest.;Bone Vulture Pokémon^They adorn themselves with bones. There seem to be fashion trends among them, as different bones come into and fall out of popularity.;Anteater Pokémon^A flame serves as its tongue, melting through the hard shell of Durant so that Heatmor can devour their insides.;Iron Ant Pokémon^With their large mandibles, these Pokémon can crunch their way through rock. They work together to protect their eggs from Sandaconda.;Irate Pokémon^Because it can’t see, this Pokémon is constantly biting at everything it touches, trying to keep track of its surroundings.;Hostile Pokémon^Their two heads will fight each other over a single piece of food. Zweilous are covered in scars even without battling others.;Brutal Pokémon^The three heads take turns sinking their teeth into the opponent. Their attacks won’t slow until their target goes down.;Torch Pokémon^Larvesta’s body is warm all over. It spouts fire from the tips of its horns to intimidate predators and scare prey.;Sun Pokémon^This Pokémon emerges from a cocoon formed of raging flames. Ancient murals depict Volcarona as a deity of fire.;Iron Will Pokémon^From the moment it’s born, this Pokémon radiates the air of a leader. Its presence will calm even vicious foes.;Cavern Pokémon^In Unovan legend, Terrakion battled against humans in an effort to protect other Pokémon.;Grassland Pokémon^It darts around opponents with a flurry of quick movements, slicing them up with its horns.;Cyclone Pokémon^This storm-stirring Pokémon is said to cause the seasons to turn by whipping up the air. I suspect its humanlike form to be a false one.;Bolt Strike Pokémon^They say this wielder of electricity has waged war with its nemesis, Tornadus, since time immemorial. The lightning bolts it hurls pierce the very earth and enrich…;Vast White Pokémon^According to myth, if people ignore truth and let themselves become consumed by greed, Reshiram will arrive to burn their kingdoms down.;Deep Black Pokémon^Mythology tells us that if people lose the righteousness in their hearts, their kingdoms will be razed by Zekrom’s lightning.;Abundance Pokémon^When the incarnations of wind and of lightning clash, Landorus arrives to quell the conflict. After the tempests and thunderbolts abate, the land is sure to be…;Boundary Pokémon^It appears that this Pokémon uses its powers over ice to freeze its own body in order to stabilize its cellular structure.;Colt Pokémon^They say that Keldeo must survive harsh battles and fully develop the horn on its forehead before this Pokémon’s true power will awaken.;Melody Pokémon^Its melodies are sung with a special vocalization method that can control the feelings of those who hear it.;Paleozoic Pokémon^This Pokémon existed 300 million years ago. Team Plasma altered it and attached a cannon to its back.;Spiny Nut Pokémon^Such a thick shell of wood covers its head and back that even a direct hit from a truck wouldn’t faze it.;Spiny Armor Pokémon^They strengthen their lower bodies by running into one another. They are very kind and won’t start fights.;Spiny Armor Pokémon^When it takes a defensive posture with its fists guarding its face, it could withstand a bomb blast.;Fox Pokémon^As it walks, it munches on a twig in place of a snack. It intimidates opponents by puffing hot air out of its ears.;Fox Pokémon^When the twig is plucked from its tail, friction sets the twig alight. The flame is used to send signals to its allies.;Fox Pokémon^Using psychic power, it generates a fiery vortex of 5,400 degrees Fahrenheit, incinerating foes swept into this whirl of flame.;Bubble Frog Pokémon^It protects its skin by covering its body in delicate bubbles. Beneath its happy-go-lucky air, it keeps a watchful eye on its surroundings.;Bubble Frog Pokémon^Its swiftness is unparalleled. It can scale a tower of more than 2,000 feet in a minute’s time.;Ninja Pokémon^It appears and vanishes with a ninja’s grace. It toys with its enemies using swift movements, while slicing them with throwing stars of sharpest water.;Digging Pokémon^It’s very sensitive to danger. The sound of Corviknight’s flapping will have Bunnelby digging a hole to hide underground in moments.;Digging Pokémon^The fur on its belly retains heat exceptionally well. People used to make heavy winter clothing from fur shed by this Pokémon.;Tiny Robin Pokémon^When this Pokémon gets excited, its body temperature increases sharply. If you touch a Fletchling with bare hands, you might get burned.;Ember Pokémon^Fletchinder are exceedingly territorial and aggressive. These Pokémon fight among themselves over feeding grounds.;Scorching Pokémon^Talonflame dives toward prey at speeds of up to 310 mph and assaults them with powerful kicks, giving the prey no chance to escape.;Scatterdust Pokémon^The powder that covers its body regulates its temperature, so it can live in any region or climate.;Scatterdust Pokémon^The beaks of bird Pokémon can’t begin to scratch its stalwart body. To defend itself, it spews powder.;Scale Pokémon^The patterns on this Pokémon’s wings depend on the climate and topography of its habitat. It scatters colorful scales.;Lion Cub Pokémon^This hot-blooded Pokémon is filled with curiosity. When it gets angry or starts fighting, its short mane gets hot.;Royal Pokémon^The temperature of its breath is over 10,000 degrees Fahrenheit, but Pyroar doesn’t use it on its prey. This Pokémon prefers to eat raw meat.;Single Bloom Pokémon^Flabébé wears a crown made from pollen it’s collected from its flower. The crown has hidden healing properties.;Single Bloom Pokémon^It gives its own power to flowers, pouring its heart into caring for them. Floette never forgives anyone who messes up a flower bed.;Garden Pokémon^Its life can span several hundred years. It’s said to devote its entire life to protecting gardens.;Mount Pokémon^If it has sunshine and water, it doesn’t need to eat, because it can generate energy from the leaves on its back.;Mount Pokémon^They inhabit mountainous regions. The leader of the herd is decided by a battle of clashing horns.;Playful Pokémon^Wanting to make sure it’s taken seriously, Pancham’s always giving others a glare. But if it’s not focusing, it ends up smiling.;Daunting Pokémon^Using its leaf, Pangoro can predict the moves of its opponents. It strikes with punches that can turn a dump truck into scrap with just one hit.;Poodle Pokémon^Left alone, its fur will grow longer and longer, but it will only allow someone it trusts to cut it.;Restraint Pokémon^There’s enough psychic power in Espurr to send a wrestler flying, but because this power can’t be controlled, Espurr finds it troublesome.;Constraint Pokémon^The defensive instinct of the males is strong. It’s when they’re protecting themselves or their partners that they unleash their full power.;Sword Pokémon^The blue eye on the sword’s handguard is the true body of Honedge. With its old cloth, it drains people’s lives away.;Sword Pokémon^The two swords employ a strategy of rapidly alternating between offense and defense to bring down their prey.;Royal Sword Pokémon^Its potent spectral powers allow it to manipulate others. It once used its powers to force people and Pokémon to build a kingdom to its liking.;Perfume Pokémon^The scent its body gives off enraptures those who smell it. Noble ladies had no shortage of love for Spritzee.;Fragrance Pokémon^The scents Aromatisse can produce range from sweet smells that bolster allies to foul smells that sap an opponent’s will to fight.;Cotton Candy Pokémon^The sweet smell of cotton candy perfumes Swirlix’s fluffy fur. This Pokémon spits out sticky string to tangle up its enemies.;Meringue Pokémon^Slurpuff’s fur contains a lot of air, making it soft to the touch and lighter than it looks.;Revolving Pokémon^By exposing foes to the blinking of its luminescent spots, Inkay demoralizes them, and then it seizes the chance to flee.;Overturning Pokémon^It’s said that Malamar’s hypnotic powers played a role in certain history-changing events.;Two-Handed Pokémon^If the two don’t work well together, both their offense and defense fall apart. Without good teamwork, they won’t survive.;Collective Pokémon^Having an eye on each palm allows it to keep watch in all directions. In a pinch, its limbs start to act on their own to ensure the enemy’s defeat.;Mock Kelp Pokémon^Skrelp looks like a piece of rotten seaweed, so it can blend in with seaweed drifting on the ocean and avoid being detected by enemies.;Mock Kelp Pokémon^Dragalge generates dragon energy by sticking the plume on its head out above the ocean’s surface and bathing it in sunlight.;Water Gun Pokémon^By detonating gas that accumulates in its right claw, this Pokémon launches water like a bullet. This is how Clauncher defeats its enemies.;Howitzer Pokémon^Clawitzer’s right arm is a cannon that launches projectiles made of seawater. Shots from a Clawitzer’s cannon arm can sink a tanker.;Generator Pokémon^The sun powers this Pokémon’s electricity generation. Interruption of that process stresses Helioptile to the point of weakness.;Generator Pokémon^One Heliolisk basking in the sun with its frill outspread is all it would take to produce enough electricity to power a city.;Royal Heir Pokémon^This Pokémon is selfish and likes to be pampered. It can also inflict grievous wounds on its Trainer just by playing around.;Despot Pokémon^A single bite of Tyrantrum’s massive jaws will demolish a car. This Pokémon was the king of the ancient world.;Tundra Pokémon^Amaura is an ancient Pokémon that has gone extinct. Specimens of this species can sometimes be found frozen in ice.;Tundra Pokémon^When gripped by rage, Aurorus will emanate freezing air, covering everything around it in ice.;Intertwining Pokémon^It emits a soothing aura from its ribbon-shaped organs. It wraps these appendages around quarrelers to instantly restore calm to the situation.;Wrestling Pokémon^It always strikes a pose before going for its finishing move. Sometimes opponents take advantage of that time to counterattack.;Antenna Pokémon^Since Dedenne can’t generate much electricity on its own, it steals electricity from outlets or other electric Pokémon.;Jewel Pokémon^It’s said that somewhere in the world, there’s a mineral vein housing a large pack of slumbering Carbink. It’s also said that this pack has a queen.;Soft Tissue Pokémon^Goomy hides away in the shade of trees, where it's nice and humid. If the slime coating its body dries out, the Pokémon instantly becomes lethargic.;Soft Tissue Pokémon^A creature given to melancholy. I suspect its metallic shell developed as a result of the mucus on its skin reacting with the iron in Hisui's water.;Dragon Pokémon^Able to freely control the hardness of its metallic shell. It loathes solitude and is extremely clingy—it will fume and run riot if those dearest to it ever leave its…;Key Ring Pokémon^Klefki sucks in metal ions with the horn topping its head. It seems this Pokémon loves keys so much that its head needed to look like one, too.;Stump Pokémon^With a voice like a human child’s, it cries out to lure adults deep into the forest, getting them lost among the trees.;Elder Tree Pokémon^Small roots that extend from the tips of this Pokémon’s feet can tie into the trees of the forest and give Trevenant control over them.;Pumpkin Pokémon^The light that streams out from the holes in the pumpkin can hypnotize and control the people and Pokémon that see it.;Pumpkin Pokémon^In the darkness of a new-moon night, Gourgeist will come knocking. Whoever answers the door will be swept off to the afterlife.;Ice Chunk Pokémon^Lives on mountains blanketed in perennial snow. It freezes water vapor in the air to make the ice helmet that it dons for defense.;Iceberg Pokémon^The armor of ice covering its lower jaw puts steel to shame and can shatter rocks with ease. This Pokémon barrels along steep mountain paths, cleaving through the…;Sound Wave Pokémon^No wavelength of sound is beyond Noibat’s ability to produce. The ultrasonic waves it generates can overcome much larger Pokémon.;Sound Wave Pokémon^Flying through the darkness, it weakens enemies with ultrasonic waves that could crush stone. Its fangs finish the fight.;Life Pokémon^When the horns on its head shine in seven colors, it is said to be sharing everlasting life.;Destruction Pokémon^When its life comes to an end, it absorbs the life energy of every living thing and turns into a cocoon once more.;Order Pokémon^Some say it can change to an even more powerful form when battling those who threaten the ecosystem.;Jewel Pokémon^It can instantly create many diamonds by compressing the carbon in the air between its hands.;Mischief Pokémon^It is said to be able to seize anything it desires with its six rings and six huge arms. With its power sealed, it is transformed into a much smaller form.;Steam Pokémon^It expels its internal steam from the arms on its back. It has enough power to blow away a mountain.;Grass Quill Pokémon^Flies noiselessly on delicate wings. It has mastered the art of deftly launching dagger-sharp feathers from those same wings.;Blade Quill Pokémon^Regularly basks in sunlight to gather power—presumably due to the frigid climate. Nonetheless, the edges of the blade quills set into its wings are keen as ever.;Arrow Quill Pokémon^The air stored inside the rachises of Decidueye's feathers insulates the Pokémon against Hisui's extreme cold. This is firm proof that evolution can be influenced by…;Fire Cat Pokémon^Trying to pet Litten before it trusts you will result in a nasty scratch from its sharp claws. Be careful.;Fire Cat Pokémon^When facing a powerful enemy, Torracat’s fighting spirit gets pumped up, and its fire bell blazes hotter.;Heel Pokémon^Incineroar’s rough and aggressive behavior is its most notable trait, but the way it helps out small Pokémon shows that it has a kind side as well.;Sea Lion Pokémon^If Popplio want to create big, powerful balloons, they must be persistent. It takes daily practice for these Pokémon to develop their skills.;Pop Star Pokémon^On nights when the sea is calm, Brionne dance with one another to the singing of the Primarina that’s leading them.;Soloist Pokémon^For Primarina, every battle’s a stage. Its singing and the dancing of its balloons will mesmerize the audience.;Woodpecker Pokémon^It may look spindly, but its neck muscles are heavy-duty. It can peck at a tree 16 times per second!;Bugle Beak Pokémon^From its mouth, it fires the seeds of berries it has eaten. The scattered seeds give rise to new plants.;Cannon Pokémon^Known for forming harmonious couples, this Pokémon is brought to wedding ceremonies as a good luck charm.;Loitering Pokémon^Although it will eat anything, it prefers fresh living things, so it marches down streets in search of prey.;Stakeout Pokémon^Patient by nature, this Pokémon loses control of itself and pounces when it spots its favorite meal—Rattata!;Larva Pokémon^It uses its big jaws to dig nests into the forest floor, and it loves to feed on sweet tree sap.;Battery Pokémon^Its digestive processes convert the leaves it eats into electricity. An electric sac in its belly stores the electricity for later use.;Stag Beetle Pokémon^If it carries a Charjabug to use as a spare battery, a flying Vikavolt can rapidly fire high-powered beams of electricity.;Boxing Pokémon^Crabrawler has been known to mistake Exeggutor for a coconut tree and climb it. The enraged Exeggutor shakes it off and stomps it.;Woolly Crab Pokémon^Before it stops to think, it just starts pummeling. There are records of its turning back avalanches with a flurry of punches.;Dancing Pokémon^This Oricorio has drunk red nectar. If its Trainer gives the wrong order, this passionate Pokémon becomes fiercely angry.;Bee Fly Pokémon^An opponent’s aura can tell Cutiefly what that opponent’s next move will be. Then Cutiefly can glide around the attack and strike back.;Bee Fly Pokémon^Ribombee absolutely hate getting wet or rained on. In the cloudy Galar region, they are very seldom seen.;Puppy Pokémon^This Pokémon intimidates opponents by striking the ground with the rocks on its neck. The moment an opponent flinches, Rockruff attacks.;Wolf Pokémon^With swift movements, this Pokémon gradually backs its prey into a corner. Lycanroc’s fangs are always aimed toward opponents’ weak spots.;Small Fry Pokémon^When it senses danger, its eyes tear up. The sparkle of its tears signals other Wishiwashi to gather.;Brutal Star Pokémon^Unlike their Alolan counterparts, the Mareanie of the Galar region have not yet figured out that the branches of Corsola are delicious.;Brutal Star Pokémon^Within the poison sac in its body is a poison so toxic that Pokémon as large as Wailord will still be suffering three days after it first takes effect.;Donkey Pokémon^It eats dirt to create mud and smears this mud all over its feet, giving them the grip needed to walk on rough terrain without slipping.;Draft Horse Pokémon^Mudsdale has so much stamina that it could carry over 10 tons across the Galar region without rest or sleep.;Water Bubble Pokémon^Dewpider normally lives underwater. When it comes onto land in search of food, it takes water with it in the form of a bubble on its head.;Water Bubble Pokémon^It acts as a caretaker for Dewpider, putting them inside its bubble and letting them eat any leftover food.;Sickle Grass Pokémon^During the day, Fomantis basks in sunlight and sleeps peacefully. It wakes and moves around at night.;Bloom Sickle Pokémon^The petals on this Pokémon’s arms are thin and super sharp, and they can fire laser beams if Lurantis gathers light first.;Illuminating Pokémon^Morelull live in forests that stay dark even during the day. They scatter flickering spores that put enemies to sleep.;Illuminating Pokémon^If you see a light deep in a forest at night, don’t go near. Shiinotic will make you fall fast asleep.;Toxic Lizard Pokémon^This sneaky Pokémon will slink behind its prey and immobilize it with poisonous gas before the prey even realizes Salandit is there.;Toxic Lizard Pokémon^The winner of competitions between Salazzle is decided by which one has the most male Salandit with it.;Flailing Pokémon^The way it protects itself by flailing its arms may be an adorable sight, but stay well away. This is flailing that can snap thick tree trunks.;Strong Arm Pokémon^The moves it uses to take down its prey would make a martial artist jealous. It tucks subdued prey under its arms to carry them to its nest.;Fruit Pokémon^When under attack, it secretes a sweet and delicious sweat. The scent only calls more enemies to it.;Fruit Pokémon^Any Corvisquire that pecks at this Pokémon will be greeted with a smack from its sepals followed by a sharp kick.;Fruit Pokémon^A kick from the hardened tips of this Pokémon’s legs leaves a wound in the opponent’s body and soul that will never heal.;Posy Picker Pokémon^These Pokémon smell very nice. All Comfey wear different flowers, so each of these Pokémon has its own individual scent.;Sage Pokémon^It knows the forest inside and out. If it comes across a wounded Pokémon, Oranguru will gather medicinal herbs to treat it.;Teamwork Pokémon^Passimian live in groups of about 20, with each member performing an assigned role. Through cooperation, the group survives.;Turn Tail Pokémon^Wimpod gather in swarms, constantly on the lookout for danger. They scatter the moment they detect an enemy’s presence.;Hard Scale Pokémon^They live in sunken ships or in holes in the seabed. When Golisopod and Grapploct battle, the loser becomes the winner’s meal.;Sand Heap Pokémon^Sandygast mainly inhabits beaches. It takes control of anyone who puts their hand into its mouth, forcing them to make its body bigger.;Sand Castle Pokémon^This Pokémon lives on beaches, but it hates water. Palossand can’t maintain its castle-like shape if it gets drenched by a heavy rain.;Sea Cucumber Pokémon^It’s covered in a slime that keeps its skin moist, allowing it to stay on land for days without drying up.;Synthetic Pokémon^It was modeled after a mighty Pokémon of myth. The mask placed upon it limits its power in order to keep it under control.;Synthetic Pokémon^The final factor needed to release this Pokémon’s true power was a strong bond with a Trainer it trusts.;Meteor Pokémon^Although its outer shell is uncommonly durable, the shock of falling to the ground smashes the shell to smithereens.;Drowsing Pokémon^It remains asleep from birth to death as a result of the sedative properties of the leaves that form its diet.;Blast Turtle Pokémon^Eating sulfur in its volcanic habitat is what causes explosive compounds to develop in its shell. Its droppings are also dangerously explosive.;Roly-Poly Pokémon^When it’s in trouble, it curls up into a ball, makes its fur spikes stand on end, and then discharges electricity indiscriminately.;Disguise Pokémon^There was a scientist who peeked under Mimikyu’s old rag in the name of research. The scientist died of a mysterious disease.;Gnash Teeth Pokémon^Its skin is thick enough to fend off Mareanie’s spikes. With its robust teeth, Bruxish crunches up the spikes and eats them.;Placid Pokémon^Drampa is a kind and friendly Pokémon—up until it’s angered. When that happens, it stirs up a gale and flattens everything around.;Sea Creeper Pokémon^After lowering its anchor, it waits for its prey. It catches large Wailord and drains their life-force.;Scaly Pokémon^Jangmo-o strikes its scales to communicate with others of its kind. Its scales are actually fur that’s become as hard as metal.;Scaly Pokémon^Before attacking its enemies, it clashes its scales together and roars. Its sharp claws shred the opposition.;Scaly Pokémon^Certain ruins have paintings of ancient warriors wearing armor made of Kommo-o scales.;Land Spirit Pokémon^The lightning-wielding guardian deity of Melemele, Tapu Koko is brimming with curiosity and appears before people from time to time.;Land Spirit Pokémon^Although called a guardian deity, Tapu Lele is devoid of guilt about its cruel disposition and can be described as nature incarnate.;Land Spirit Pokémon^It makes ringing sounds with its tail to let others know where it is, avoiding unneeded conflicts. This guardian deity of Ula’ula controls plants.;Land Spirit Pokémon^Although it’s called a guardian deity, terrible calamities sometimes befall those who recklessly approach Tapu Fini.;Nebula Pokémon^Cosmog is very curious but not very cautious, often placing itself in danger. If things start to look dicey, it teleports away.;Protostar Pokémon^It sucks in dust from the air at an astounding rate, frantically building up energy within its core as preparation for evolution.;Sunne Pokémon^Solgaleo was once known as the Beast That Devours the Sun. Energy in the form of light radiates boundlessly from it.;Moone Pokémon^It steals the light from its surroundings and then becomes the full moon, showering its own light across the night sky.;Parasite Pokémon^It appeared in this world from an Ultra Wormhole. Nihilego appears to be a parasite that lives by feeding on people and Pokémon.;Swollen Pokémon^Buzzwole goes around showing off its abnormally swollen muscles. It is one kind of Ultra Beast.;Lissome Pokémon^Although it’s alien to this world and a danger here, it’s apparently a common organism in the world where it normally lives.;Glowing Pokémon^They’ve been dubbed Ultra Beasts. Some of them stand unmoving, like trees, with their arms and legs stuck into the ground.;Launch Pokémon^Although it’s alien to this world and a danger here, it’s apparently a common organism in the world where it normally lives.;Drawn Sword Pokémon^Although it’s alien to this world and a danger here, it’s apparently a common organism in the world where it normally lives.;Junkivore Pokémon^An unknown life-form called a UB. It may be constantly hungry—it is certainly always devouring something.;Prism Pokémon^It needs light to survive, and it goes on a rampage seeking it out. Its laser beams will cut anything to pieces.;Artificial Pokémon^Built roughly 500 years ago by a scientist, the part called the Soul-Heart is the actual life-form.;Gloomdweller Pokémon^This Pokémon can conceal itself in any shadow, so it went undiscovered for a long time.;Poison Pin Pokémon^An Ultra Beast that lives in a different world, it cackles wildly as it sprays its opponents with poison from the needles on its head.;Poison Pin Pokémon^One kind of Ultra Beast, it fires a glowing, venomous liquid from its needles. This liquid is also immensely adhesive.;Rampart Pokémon^When stone walls started moving and attacking, the brute’s true identity was this mysterious life-form, which brings to mind an Ultra Beast.;Fireworks Pokémon^A UB that appeared from an Ultra Wormhole, it causes explosions, then takes advantage of opponents’ surprise to rob them of their vitality.;Thunderclap Pokémon^Electricity sparks from the pads on its limbs. Wherever Zeraora runs, lightning flashes and thunder echoes.;Hex Nut Pokémon^They live as a group, but when the time comes, one strong Meltan will absorb all the others and evolve.;Hex Nut Pokémon^Centrifugal force is behind the punches of Melmetal’s heavy hex-nut arms. Melmetal is said to deliver the strongest punches of all Pokémon.;Chimp Pokémon^It attacks with rapid beats of its stick. As it strikes with amazing speed, it gets more and more pumped.;Beat Pokémon^When it’s drumming out rapid beats in battle, it gets so caught up in the rhythm that it won’t even notice that it’s already knocked out its opponent.;Drummer Pokémon^The one with the best drumming techniques becomes the boss of the troop. It has a gentle disposition and values harmony among its group.;Rabbit Pokémon^It has special pads on the backs of its feet, and one on its nose. Once it’s raring to fight, these pads radiate tremendous heat.;Rabbit Pokémon^It kicks berries right off the branches of trees and then juggles them with its feet, practicing its footwork.;Striker Pokémon^It’s skilled at both offense and defense, and it gets pumped up when cheered on. But if it starts showboating, it could put itself in a tough spot.;Water Lizard Pokémon^When it gets wet, its skin changes color, and this Pokémon becomes invisible as if it were camouflaged.;Water Lizard Pokémon^Highly intelligent but also very lazy, it keeps enemies out of its territory by laying traps everywhere.;Secret Agent Pokémon^Its nictitating membranes let it pick out foes’ weak points so it can precisely blast them with water that shoots from its fingertips at Mach 3.;Cheeky Pokémon^It eats berries nonstop—a habit that has made it more resilient than it looks. It’ll show up on farms, searching for yet more berries.;Greedy Pokémon^Common throughout the Galar region, this Pokémon has strong teeth and can chew through the toughest of berry shells.;Tiny Bird Pokémon^Jumping nimbly about, this small-bodied Pokémon takes advantage of even the slightest opportunity to disorient larger opponents.;Raven Pokémon^The lessons of many harsh battles have taught it how to accurately judge an opponent’s strength.;Raven Pokémon^With their great intellect and flying skills, these Pokémon very successfully act as the Galar region’s airborne taxi service.;Larva Pokémon^Often found in gardens, this Pokémon has hairs on its body that it uses to assess its surroundings.;Radome Pokémon^As it grows inside its shell, it uses its psychic abilities to monitor the outside world and prepare for evolution.;Seven Spot Pokémon^It emits psychic energy to observe and study what’s around it—and what’s around it can include things over six miles away.;Fox Pokémon^Cunning and cautious, this Pokémon survives by stealing food from others. It erases its tracks with swipes of its tail as it makes off with its plunder.;Fox Pokémon^With a lithe body and sharp claws, it goes around stealing food and eggs. Boltund is its natural enemy.;Flowering Pokémon^It whirls around in the wind while singing a joyous song. This delightful display has charmed many into raising this Pokémon.;Cotton Bloom Pokémon^The cotton on the head of this Pokémon can be spun into a glossy, gorgeous yarn—a Galar regional specialty.;Sheep Pokémon^If its fleece grows too long, Wooloo won’t be able to move. Cloth made with the wool of this Pokémon is surprisingly strong.;Sheep Pokémon^Its majestic horns are meant only to impress the opposite gender. They never see use in battle.;Snapping Pokémon^It starts off battles by attacking with its rock-hard horn, but as soon as the opponent flinches, this Pokémon bites down and never lets go.;Bite Pokémon^This Pokémon rapidly extends its retractable neck to sink its sharp fangs into distant enemies and take them down.;Puppy Pokémon^This gluttonous Pokémon only assists people with their work because it wants treats. As it runs, it crackles with electricity.;Dog Pokémon^It sends electricity through its legs to boost their strength. Running at top speed, it easily breaks 50 mph.;Coal Pokémon^It can race around like a unicycle, even on rough, rocky terrain. Burning coal sustains it.;Coal Pokémon^By rapidly rolling its legs, it can travel at over 18 mph. The temperature of the flames it breathes exceeds 1,800 degrees Fahrenheit.;Coal Pokémon^While it’s engaged in battle, its mountain of coal will burn bright red, sending off sparks that scorch the surrounding area.;Apple Core Pokémon^As soon as it’s born, it burrows into an apple. Not only does the apple serve as its food source, but the flavor of the fruit determines its evolution.;Apple Wing Pokémon^It flies on wings of apple skin and spits a powerful acid. It can also change its shape into that of an apple.;Apple Nectar Pokémon^Its body is covered in sweet nectar, and the skin on its back is especially yummy. Children used to have it as a snack.;Sand Snake Pokémon^It spews sand from its nostrils. While the enemy is blinded, it burrows into the ground to hide.;Sand Snake Pokémon^Its unique style of coiling allows it to blast sand out of its sand sac more efficiently.;Gulp Pokémon^This hungry Pokémon swallows Arrokuda whole. Occasionally, it makes a mistake and tries to swallow a Pokémon other than its preferred prey.;Rush Pokémon^After it’s eaten its fill, its movements become extremely sluggish. That’s when Cramorant swallows it up.;Skewer Pokémon^It spins its tail fins to propel itself, surging forward at speeds of over 100 knots before ramming prey and spearing into them.;Baby Pokémon^It manipulates the chemical makeup of its poison to produce electricity. The voltage is weak, but it can cause a tingling paralysis.;Punk Pokémon^This short-tempered and aggressive Pokémon chugs stagnant water to absorb any toxins it might contain.;Radiator Pokémon^It wraps prey up with its heated body, cooking them in its coils. Once they’re well-done, it will voraciously nibble them down to the last morsel.;Radiator Pokémon^While its burning body is already dangerous on its own, this excessively hostile Pokémon also has large and very sharp fangs.;Tantrum Pokémon^Its tentacles tear off easily, but it isn’t alarmed when that happens—it knows they’ll grow back. It’s about as smart as a three-year-old.;Jujitsu Pokémon^Searching for an opponent to test its skills against, it emerges onto land. Once the battle is over, it returns to the sea.;Black Tea Pokémon^The teacup in which this Pokémon makes its home is a famous piece of antique tableware. Many forgeries are in circulation.;Black Tea Pokémon^Leaving leftover black tea unattended is asking for this Pokémon to come along and pour itself into it, turning the tea into a new Polteageist.;Calm Pokémon^If this Pokémon senses a strong emotion, it will run away as fast as it can. It prefers areas without people.;Serene Pokémon^Using the braids on its head, it pummels foes to get them to quiet down. One blow from those braids would knock out a professional boxer.;Silent Pokémon^If you’re too loud around it, you risk being torn apart by the claws on its tentacle. This Pokémon is also known as the Forest Witch.;Wily Pokémon^It sneaks into people’s homes, stealing things and feasting on the negative energy of the frustrated occupants.;Devious Pokémon^With sly cunning, it tries to lure people into the woods. Some believe it to have the power to make crops grow.;Bulk Up Pokémon^Its hairs work like muscle fibers. When its hairs unfurl, they latch on to opponents, ensnaring them as tentacles would.;Blocking Pokémon^It evolved after experiencing numerous fights. While crossing its arms, it lets out a shout that would make any opponent flinch.;Viking Pokémon^After many battles, it evolved dangerous claws that come together to form daggers when extended.;Coral Pokémon^Be cautious of the ectoplasmic body surrounding its soul. You’ll become stiff as stone if you touch it.;Wild Duck Pokémon^After deflecting attacks with its hard leaf shield, it strikes back with its sharp leek stalk. The leek stalk is both weapon and food.;Comedian Pokémon^Its amusing movements make it very popular. It releases its psychic power from the pattern on its belly.;Grudge Pokémon^Never touch its shadowlike body, or you’ll be shown the horrific memories behind the picture carved into it.;Cream Pokémon^They say that any patisserie visited by Milcery is guaranteed success and good fortune.;Cream Pokémon^When Alcremie is content, the cream it secretes from its hands becomes sweeter and richer.;Formation Pokémon^The six of them work together as one Pokémon. Teamwork is also their battle strategy, and they constantly change their formation as they fight.;Sea Urchin Pokémon^It stores electricity in each spine. Even if one gets broken off, it still continues to emit electricity for at least three hours.;Worm Pokémon^It eats snow that piles up on the ground. The more snow it eats, the bigger and more impressive the spikes on its back grow.;Frost Moth Pokémon^It shows no mercy to any who desecrate fields and mountains. It will fly around on its icy wings, causing a blizzard to chase offenders away.;Big Rock Pokémon^Once a year, on a specific date and at a specific time, they gather out of nowhere and form up in a circle.;Penguin Pokémon^This Pokémon keeps its heat-sensitive head cool with ice. It fishes for its food, dangling its single hair into the sea to lure in prey.;Emotion Pokémon^Through its horns, it can pick up on the emotions of creatures around it. Positive emotions are the source of its strength.;Two-Sided Pokémon^It carries electrically roasted seeds with it as if they’re precious treasures. No matter how much it eats, it always gets hungry again in short order.;Copperderm Pokémon^If a job requires serious strength, this Pokémon will excel at it. Its copper body tarnishes in the rain, turning a vibrant green color.;Copperderm Pokémon^These Pokémon live in herds. Their trunks have incredible grip strength, strong enough to crush giant rocks into powder.;Fossil Pokémon^The powerful muscles in its tail generate its electricity. Compared to its lower body, its upper half is entirely too small.;Fossil Pokémon^This Pokémon lived on prehistoric seashores and was able to preserve food with the ice on its body. It went extinct because it moved so slowly.;Fossil Pokémon^Its mighty legs are capable of running at speeds exceeding 40 mph, but this Pokémon can’t breathe unless it’s underwater.;Fossil Pokémon^The skin on its face is impervious to attack, but breathing difficulties made this Pokémon go extinct anyway.;Alloy Pokémon^The special metal that composes its body is very light, so this Pokémon has considerable agility. It lives in caves because it dislikes the rain.;Lingering Pokémon^If this weak Pokémon is by itself, a mere child could defeat it. But if Dreepy has friends to help it train, it can evolve and become much stronger.;Caretaker Pokémon^Without a Dreepy to place on its head and care for, it gets so uneasy it’ll try to substitute any Pokémon it finds for the missing Dreepy.;Stealth Pokémon^Apparently the Dreepy inside Dragapult’s horns eagerly look forward to being launched out at Mach speeds.;Warrior Pokémon^This Pokémon has slumbered for many years. Some say it’s Zamazenta’s elder sister—others say the two Pokémon are rivals.;Warrior Pokémon^This Pokémon slept for aeons while in the form of a statue. It was asleep for so long, people forgot that it ever existed.;Gigantic Pokémon^It was inside a meteorite that fell 20,000 years ago. There seems to be a connection between this Pokémon and the Dynamax phenomenon.;Wushu Pokémon^If Kubfu pulls the long white hair on its head, its fighting spirit heightens and power wells up from the depths of its belly.;Wushu Pokémon^Inhabiting the mountains of a distant region, this Pokémon races across sheer cliffs, training its legs and refining its moves.;Rogue Monkey Pokémon^Once the vines on Zarude’s body tear off, they become nutrients in the soil. This helps the plants of the forest grow.;Electron Pokémon^Its entire body is made up of a single organ that generates electrical energy. Regieleki is capable of creating all Galar’s electricity.;Dragon Orb Pokémon^Its body is composed of crystallized dragon energy. Regidrago is said to have the powers of every dragon Pokémon.;Wild Horse Pokémon^Glastrier has tremendous physical strength, and the mask of ice covering its face is 100 times harder than diamond.;Swift Horse Pokémon^As it dashes through the night, Spectrier absorbs the life-force of sleeping creatures. It craves silence and solitude.;King Pokémon^Calyrex is known in legend as a king that ruled over Galar in ancient times. It has the power to cause hearts to mend and plants to spring forth.;Big Horn Pokémon^The black orbs shine with an uncanny light when the Pokémon is erecting invisible barriers. The fur shed from its beard retains heat well and is a highly useful…;Axe Pokémon^A violent creature that fells towering trees with its crude axes and shields itself with hard stone. If one should chance upon this Pokémon in the wilds, one's only…;Peat Pokémon^I believe it was Hisui's swampy terrain that gave Ursaluna its burly physique and newfound capacity to manipulate peat at will.;Big Fish Pokémon^Clads itself in the souls of comrades that perished before fulfilling their goals of journeying upstream. No other species throughout all Hisui's rivers is…;Free Climb Pokémon^Because of Sneasler's virulent poison and daunting physical prowess, no other species could hope to best it on the frozen highlands. Preferring solitude, this species…;Pin Cluster Pokémon^Its lancelike spikes and savage temperament have earned it the nickname ”sea fiend.” It slurps up poison to nourish itself.;Love-Hate Pokémon^When it flies to this land from across the sea, the bitter winter comes to an end. According to legend, this Pokémon's love gives rise to the budding of fresh life…".split(";").map((e) => {
  const [genus, flavor] = e.split("^");
  return { genus, flavor };
});
const EVO = {};
"1:2;2:3;4:5;5:6;7:8;8:9;10:11;11:12;13:14;14:15;16:17;17:18;19:20;21:22;23:24;25:26;27:28;29:30;30:31;32:33;33:34;35:36;37:38;39:40;41:42;42:169;43:44;44:45,182;46:47;48:49;50:51;52:53,863;54:55;56:57;58:59;60:61;61:62,186;63:64;64:65;66:67;67:68;69:70;70:71;72:73;74:75;75:76;77:78;79:80,199;81:82;82:462;83:865;84:85;86:87;88:89;90:91;92:93;93:94;95:208;96:97;98:99;100:101;102:103;104:105;108:463;109:110;111:112;112:464;113:242;114:465;116:117;117:230;118:119;120:121;122:866;123:212,900;125:466;126:467;129:130;133:134,135,136,196,197,470,471,700;137:233;138:139;140:141;147:148;148:149;152:153;153:154;155:156;156:157;158:159;159:160;161:162;163:164;165:166;167:168;170:171;172:25;173:35;174:39;175:176;176:468;177:178;179:180;180:181;183:184;187:188;188:189;190:424;191:192;193:469;194:195;198:430;200:429;204:205;207:472;209:210;211:904;215:461,903;216:217;217:901;218:219;220:221;221:473;222:864;223:224;228:229;231:232;233:474;234:899;236:106,107,237;238:124;239:125;240:126;246:247;247:248;252:253;253:254;255:256;256:257;258:259;259:260;261:262;263:264;264:862;265:266,268;266:267;268:269;270:271;271:272;273:274;274:275;276:277;278:279;280:281;281:282,475;283:284;285:286;287:288;288:289;290:291,292;293:294;294:295;296:297;298:183;299:476;300:301;304:305;305:306;307:308;309:310;315:407;316:317;318:319;320:321;322:323;325:326;328:329;329:330;331:332;333:334;339:340;341:342;343:344;345:346;347:348;349:350;353:354;355:356;356:477;360:202;361:362,478;363:364;364:365;366:367,368;371:372;372:373;374:375;375:376;387:388;388:389;390:391;391:392;393:394;394:395;396:397;397:398;399:400;401:402;403:404;404:405;406:315;408:409;410:411;412:413,414;415:416;418:419;420:421;422:423;425:426;427:428;431:432;433:358;434:435;436:437;438:185;439:122;440:113;443:444;444:445;446:143;447:448;449:450;451:452;453:454;456:457;458:226;459:460;495:496;496:497;498:499;499:500;501:502;502:503;504:505;506:507;507:508;509:510;511:512;513:514;515:516;517:518;519:520;520:521;522:523;524:525;525:526;527:528;529:530;532:533;533:534;535:536;536:537;540:541;541:542;543:544;544:545;546:547;548:549;550:902;551:552;552:553;554:555;557:558;559:560;562:563,867;564:565;566:567;568:569;570:571;572:573;574:575;575:576;577:578;578:579;580:581;582:583;583:584;585:586;588:589;590:591;592:593;595:596;597:598;599:600;600:601;602:603;603:604;605:606;607:608;608:609;610:611;611:612;613:614;616:617;619:620;622:623;624:625;627:628;629:630;633:634;634:635;636:637;650:651;651:652;653:654;654:655;656:657;657:658;659:660;661:662;662:663;664:665;665:666;667:668;669:670;670:671;672:673;674:675;677:678;679:680;680:681;682:683;684:685;686:687;688:689;690:691;692:693;694:695;696:697;698:699;704:705;705:706;708:709;710:711;712:713;714:715;722:723;723:724;725:726;726:727;728:729;729:730;731:732;732:733;734:735;736:737;737:738;739:740;742:743;744:745;747:748;749:750;751:752;753:754;755:756;757:758;759:760;761:762;762:763;767:768;769:770;772:773;782:783;783:784;789:790;790:791,792;803:804;808:809;810:811;811:812;813:814;814:815;816:817;817:818;819:820;821:822;822:823;824:825;825:826;827:828;829:830;831:832;833:834;835:836;837:838;838:839;840:841,842;843:844;846:847;848:849;850:851;852:853;854:855;856:857;857:858;859:860;860:861;868:869;872:873;878:879;885:886;886:887;891:892".split(";").forEach((e) => {
  const [k, v] = e.split(":");
  EVO[+k] = v.split(",").map(Number);
});
const canEvolve = (p) => !!EVO[p.id];

const SHEET_COLS = 30, SHEET_CELL = 48;
const TSHEET_COLS = 10, TSHEET_CELL = 80;

/* Sheet health check — if a spritesheet fails to load, fall back to per-Pokémon images */
const sheetStatus = {};
const sheetListeners = {};
const probeSheet = (url) => {
  if (sheetStatus[url]) return;
  sheetStatus[url] = "loading";
  const im = new Image();
  im.onload = () => { sheetStatus[url] = "ok"; (sheetListeners[url] || []).forEach((f) => f("ok")); };
  im.onerror = () => { sheetStatus[url] = "fail"; (sheetListeners[url] || []).forEach((f) => f("fail")); };
  im.src = url;
};
const useSheet = (url) => {
  const [st, setSt] = useState(sheetStatus[url] === "fail" ? "fail" : "ok");
  useEffect(() => {
    probeSheet(url);
    if (sheetStatus[url] === "ok" || sheetStatus[url] === "fail") { setSt(sheetStatus[url]); return; }
    const f = (s) => setSt(s);
    (sheetListeners[url] = sheetListeners[url] || []).push(f);
    return () => { sheetListeners[url] = (sheetListeners[url] || []).filter((x) => x !== f); };
  }, [url]);
  return st !== "fail";
};
const rawSprite = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const Pokeball = ({ size }) => (
  <div style={{ width:size*.62, height:size*.62, borderRadius:"50%", position:"relative",
    background:"linear-gradient(180deg,#E3350D 48%,#0b0f1e 48%,#0b0f1e 52%,#fff 52%)",
    border:"3px solid #1c2440" }}>
    <div style={{ position:"absolute", inset:0, margin:"auto", width:"26%", height:"26%",
      borderRadius:"50%", background:"#fff", border:"3px solid #1c2440" }}/>
  </div>
);
const trainerKey = (name) =>
  ({ "Lt. Surge":"Lt._Surge", "Tate & Liza":"Tate_and_Liza", "Crasher Wake":"Crasher_Wake" }[name] || name);

/* ---------------- Regions & Bosses ----------------
   13 per region: 8 gyms + 4 elites + champion.
   Alola & Galar normalized to the 13-battle format.    */
const L = (name, type, ace, role, img) => ({ name, type, ace, role, img: img || name.toLowerCase().replace(/[^a-z]/g, "") });
const REGIONS = [
  { name:"Kanto", gen:1, color:"#E3350D", bosses:[
    L("Brock","rock",95,"GYM"),L("Misty","water",121,"GYM"),L("Lt. Surge","electric",26,"GYM","ltsurge"),L("Erika","grass",45,"GYM"),
    L("Koga","poison",110,"GYM"),L("Sabrina","psychic",65,"GYM"),L("Blaine","fire",59,"GYM"),L("Giovanni","ground",112,"GYM"),
    L("Lorelei","ice",131,"ELITE"),L("Bruno","fighting",68,"ELITE"),L("Agatha","ghost",94,"ELITE"),L("Lance","dragon",149,"ELITE"),
    L("Blue","water",9,"CHAMPION")]},
  { name:"Johto", gen:2, color:"#D6A21B", bosses:[
    L("Falkner","flying",18,"GYM"),L("Bugsy","bug",123,"GYM"),L("Whitney","normal",241,"GYM"),L("Morty","ghost",94,"GYM"),
    L("Chuck","fighting",62,"GYM"),L("Jasmine","steel",208,"GYM"),L("Pryce","ice",221,"GYM"),L("Clair","dragon",230,"GYM"),
    L("Will","psychic",178,"ELITE"),L("Koga","poison",169,"ELITE"),L("Bruno","fighting",68,"ELITE"),L("Karen","dark",197,"ELITE"),
    L("Lance","dragon",149,"CHAMPION")]},
  { name:"Hoenn", gen:3, color:"#1B9E5A", bosses:[
    L("Roxanne","rock",299,"GYM"),L("Brawly","fighting",297,"GYM"),L("Wattson","electric",310,"GYM"),L("Flannery","fire",324,"GYM"),
    L("Norman","normal",289,"GYM"),L("Winona","flying",334,"GYM"),L("Tate & Liza","psychic",338,"GYM","tateandliza"),L("Wallace","water",350,"GYM"),
    L("Sidney","dark",359,"ELITE"),L("Phoebe","ghost",356,"ELITE"),L("Glacia","ice",365,"ELITE"),L("Drake","dragon",373,"ELITE"),
    L("Steven","steel",376,"CHAMPION")]},
  { name:"Sinnoh", gen:4, color:"#4A7DC9", bosses:[
    L("Roark","rock",409,"GYM"),L("Gardenia","grass",407,"GYM"),L("Maylene","fighting",448,"GYM"),L("Crasher Wake","water",419,"GYM","crasherwake"),
    L("Fantina","ghost",429,"GYM"),L("Byron","steel",411,"GYM"),L("Candice","ice",460,"GYM"),L("Volkner","electric",466,"GYM"),
    L("Aaron","bug",452,"ELITE"),L("Bertha","ground",450,"ELITE"),L("Flint","fire",392,"ELITE"),L("Lucian","psychic",437,"ELITE"),
    L("Cynthia","dragon",445,"CHAMPION")]},
  { name:"Unova", gen:5, color:"#3E3E3E", bosses:[
    L("Cilan","grass",511,"GYM"),L("Lenora","normal",505,"GYM"),L("Burgh","bug",542,"GYM"),L("Elesa","electric",523,"GYM"),
    L("Clay","ground",530,"GYM"),L("Skyla","flying",581,"GYM"),L("Brycen","ice",614,"GYM"),L("Drayden","dragon",612,"GYM"),
    L("Shauntal","ghost",609,"ELITE"),L("Grimsley","dark",625,"ELITE"),L("Caitlin","psychic",576,"ELITE"),L("Marshal","fighting",620,"ELITE"),
    L("Alder","bug",637,"CHAMPION")]},
  { name:"Kalos", gen:6, color:"#C957B5", bosses:[
    L("Viola","bug",666,"GYM"),L("Grant","rock",696,"GYM"),L("Korrina","fighting",448,"GYM"),L("Ramos","grass",673,"GYM"),
    L("Clemont","electric",695,"GYM"),L("Valerie","fairy",700,"GYM"),L("Olympia","psychic",678,"GYM"),L("Wulfric","ice",713,"GYM"),
    L("Malva","fire",663,"ELITE"),L("Siebold","water",689,"ELITE"),L("Wikstrom","steel",681,"ELITE"),L("Drasna","dragon",715,"ELITE"),
    L("Diantha","fairy",282,"CHAMPION")]},
  { name:"Alola", gen:7, color:"#F4842C", bosses:[
    L("Ilima","normal",735,"GYM"),L("Lana","water",746,"GYM"),L("Kiawe","fire",758,"GYM"),L("Mallow","grass",754,"GYM"),
    L("Sophocles","electric",738,"GYM"),L("Mina","fairy",743,"GYM"),L("Nanu","dark",53,"GYM"),L("Hala","fighting",740,"GYM"),
    L("Olivia","rock",745,"ELITE"),L("Molayne","steel",51,"ELITE"),L("Acerola","ghost",770,"ELITE"),L("Kahili","flying",733,"ELITE"),
    L("Kukui","fire",727,"CHAMPION")]},
  { name:"Galar", gen:8, color:"#7B3FD3", bosses:[
    L("Milo","grass",830,"GYM"),L("Nessa","water",834,"GYM"),L("Kabu","fire",851,"GYM"),L("Bea","fighting",68,"GYM"),
    L("Opal","fairy",869,"GYM"),L("Gordie","rock",839,"GYM"),L("Piers","dark",862,"GYM"),L("Raihan","dragon",884,"GYM"),
    L("Marnie","dark",861,"ELITE"),L("Hop","normal",832,"ELITE"),L("Bede","fairy",858,"ELITE"),L("Mustard","fighting",892,"ELITE"),
    L("Leon","fire",6,"CHAMPION")]},
];

/* ---------------- Battle engine ---------------- */
const DIFFS = {
  easy:   { label:"EASY",   rerolls:6, tokens:3, tokenPerGym:true,  bossMult:0.88, desc:"6 spins/pick · 3 evo tokens · +1 per gym" },
  normal: { label:"NORMAL", rerolls:3, tokens:1, tokenPerGym:true,  bossMult:1.0,  desc:"3 spins/pick · 1 evo token · +1 per gym" },
  hard:   { label:"HARD",   rerolls:1, tokens:0, tokenPerGym:false, bossMult:1.12, desc:"1 spin/pick · no tokens · brutal" },
};

const bossPower = (battleIdx, diffMult) => {
  let base;
  if (battleIdx < 8) base = 240 + battleIdx * 28;          // gyms: 240 → 436
  else if (battleIdx < 12) base = 470 + (battleIdx - 8) * 26; // elites: 470 → 548
  else base = 600;                                          // champion
  return base * diffMult;
};

/* deterministic PRNG so each leader fields the same squad every run */
const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const seeded = (seed) => () => { seed = Math.imul(seed ^ (seed >>> 15), seed | 1); seed ^= seed + Math.imul(seed ^ (seed >>> 7), seed | 61); return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296; };

const bossTeam = (leader, battleIdx, regionGen) => {
  const size = leader.role === "CHAMPION" ? 6 : leader.role === "ELITE" ? 4 : 3;
  const rng = seeded(hashStr(leader.name + leader.type + regionGen));
  const ace = byId(leader.ace);
  let cands;
  if (leader.role === "CHAMPION") {
    cands = DEX.filter((p) => p.gen <= regionGen && !p.leg && p.bst >= 480 && p.id !== ace.id);
  } else {
    cands = DEX.filter((p) => p.gen <= regionGen && !p.leg && p.types.includes(leader.type) && p.id !== ace.id);
    if (cands.length < size + 4) cands = DEX.filter((p) => !p.leg && p.types.includes(leader.type) && p.id !== ace.id);
  }
  // pull squad members from a power band that scales with gauntlet position
  cands = [...cands].sort((a, b) => a.bst - b.bst);
  const t = battleIdx / 12; // 0 → 1
  const squad = [];
  const usedNames = new Set([ace.name]);
  let guard = 0;
  while (squad.length < size - 1 && guard++ < 200 && cands.length) {
    const center = (0.25 + 0.65 * t) * (cands.length - 1);
    const idx = Math.max(0, Math.min(cands.length - 1, Math.round(center + (rng() - 0.5) * cands.length * 0.4)));
    const m = cands[idx];
    if (!usedNames.has(m.name) && !squad.includes(m)) { squad.push(m); usedNames.add(m.name); }
  }
  squad.push(ace); // ace goes last, like the games
  return squad;
};

/* matchup multiplier for one of YOUR Pokémon vs the boss's full squad */
const battleMod = (p, bteam) => {
  const offs = bteam.map((m) => Math.max(...p.types.map((t) => eff(t, m.types))));
  const incs = bteam.map((m) => Math.max(...m.types.map((t) => eff(t, p.types))));
  const off = offs.reduce((a, b) => a + b, 0) / offs.length;
  const inc = incs.reduce((a, b) => a + b, 0) / incs.length;
  const raw = Math.pow(Math.max(off, 0.2), 0.55) * Math.pow(1 / Math.max(inc, 0.3), 0.32);
  return Math.min(1.1, Math.max(0.9, raw)); // balanced: buffs & nerfs cap at ±10%
};

const pokeScore = (p, bteam) => p.bst * battleMod(p, bteam);

const W = [0.3, 0.23, 0.17, 0.12, 0.1, 0.08];
const teamScore = (team, bteam, expBonus) => {
  const scores = team.map((p) => pokeScore(p, bteam)).sort((a, b) => b - a);
  return scores.reduce((s, v, i) => s + v * (W[i] || 0), 0) + expBonus;
};

const winProb = (team, bteam, battleIdx, diffMult, expBonus) => {
  const ts = teamScore(team, bteam, expBonus);
  const bp = bossPower(battleIdx, diffMult);
  const p = 1 / (1 + Math.exp(-(ts - bp) / 68));
  return Math.min(Math.max(p, 0.03), 0.985);
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------------- Visual atoms ---------------- */
const TypeBadge = ({ t, size = 10 }) => (
  <span style={{
    background: TYPE_COLORS[t], color: "#0b0f1e", fontSize: size,
    fontFamily: "'Press Start 2P', monospace", padding: "3px 8px",
    borderRadius: 4, textTransform: "uppercase", letterSpacing: 1,
    boxShadow: "0 2px 0 rgba(0,0,0,.35)", display: "inline-block",
  }}>{t}</span>
);

const Sprite = ({ id, size = 96, glow, bounce }) => {
  const sheetOk = useSheet(POKESHEET);
  const [imgFail, setImgFail] = useState(false);
  const scale = size / SHEET_CELL;
  const col = (id - 1) % SHEET_COLS, row = Math.floor((id - 1) / SHEET_COLS);
  const ROWS = Math.ceil(905 / SHEET_COLS);
  if (sheetOk) {
    return (
      <div className={bounce ? "spriteBounce" : ""} role="img" aria-label={byId(id).name} style={{
        width: size, height: size,
        backgroundImage: `url(${POKESHEET})`,
        backgroundSize: `${SHEET_COLS * SHEET_CELL * scale}px ${ROWS * SHEET_CELL * scale}px`,
        backgroundPosition: `-${col * SHEET_CELL * scale}px -${row * SHEET_CELL * scale}px`,
        imageRendering: "pixelated",
        filter: glow ? `drop-shadow(0 0 14px ${glow})` : "none",
      }}/>
    );
  }
  return (
    <div className={bounce ? "spriteBounce" : ""} style={{
      width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center",
      filter: glow ? `drop-shadow(0 0 14px ${glow})` : "none" }}>
      {imgFail ? <Pokeball size={size}/> : (
        <img src={rawSprite(id)} alt={byId(id).name} onError={() => setImgFail(true)}
          style={{ width:"100%", height:"100%", objectFit:"contain", imageRendering:"pixelated" }}/>
      )}
    </div>
  );
};

const Trainer = ({ name, size = 90, glow }) => {
  const sheetOk = useSheet(TRAINERSHEET);
  const key = trainerKey(name);
  const idx = TRAINER_INDEX.names.indexOf(key);
  const ok = sheetOk && idx >= 0 && TRAINER_INDEX.have[idx] === 1;
  if (!ok) {
    return (
      <div style={{ width:size, height:size, borderRadius:"50%", background:"#1c2440",
        border:"3px solid #2a3354", display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'Press Start 2P', monospace", fontSize:size*.3, color:"#7d87ad",
        filter: glow ? `drop-shadow(0 0 12px ${glow})` : "none" }}>
        {name[0]}
      </div>
    );
  }
  const scale = size / TSHEET_CELL;
  const col = idx % TSHEET_COLS, row = Math.floor(idx / TSHEET_COLS);
  const ROWS = Math.ceil(TRAINER_INDEX.names.length / TSHEET_COLS);
  return (
    <div style={{
      width: size, height: size,
      backgroundImage: `url(${TRAINERSHEET})`,
      backgroundSize: `${TSHEET_COLS * TSHEET_CELL * scale}px ${ROWS * TSHEET_CELL * scale}px`,
      backgroundPosition: `-${col * TSHEET_CELL * scale}px -${row * TSHEET_CELL * scale}px`,
      imageRendering: "pixelated",
      filter: glow ? `drop-shadow(0 0 12px ${glow})` : "none",
    }}/>
  );
};

const StatBar = ({ label, value, max = 200, compact }) => {
  const pct = Math.min(100, (value / max) * 100);
  const col = value >= 110 ? "#6CF06C" : value >= 75 ? "#FFCB05" : "#F85888";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, margin: compact ? "3px 0" : "5px 0" }}>
      <div style={{ width:42, fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#9aa6cf", textAlign:"right" }}>{label}</div>
      <div style={{ flex:1, height: compact ? 7 : 9, background:"#1c2440", borderRadius:4, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:4, transition:"width .5s ease" }}/>
      </div>
      <div style={{ width:30, fontFamily:"'IBM Plex Mono', monospace", fontSize:11, color:"#cfd6f4", fontWeight:600 }}>{value}</div>
    </div>
  );
};

const TierBadge = ({ bst, size = 12 }) => {
  const t = tierOf(bst);
  return (
    <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:size, color:"#0b0f1e",
      background:TIER_COLORS[t], padding:"3px 8px", borderRadius:4,
      boxShadow:`0 0 14px ${TIER_COLORS[t]}66` }}>{t}</span>
  );
};

const Btn = ({ children, onClick, color = "#FFCB05", disabled, big, ghost, style, cls }) => (
  <button onClick={onClick} disabled={disabled} className={`gbtn ${cls || ""}`} style={{
    fontFamily: "'Press Start 2P', monospace",
    fontSize: big ? "clamp(11px,3.4vw,14px)" : "clamp(9px,2.9vw,11px)",
    padding: big ? "16px 22px" : "12px 14px", minHeight: 46,
    background: ghost ? "transparent" : disabled ? "#2a3354" : color,
    color: ghost ? color : disabled ? "#7d87ad" : "#0b0f1e",
    border: ghost ? `2px solid ${color}` : "none",
    borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled || ghost ? "none" : `0 4px 0 rgba(0,0,0,.45)`,
    letterSpacing: 1, transition: "transform .08s",
    transform: "translateY(0)", ...style,
  }}
  onMouseDown={(e)=>{ if(!disabled) e.currentTarget.style.transform="translateY(3px)";}}
  onMouseUp={(e)=>{ e.currentTarget.style.transform="translateY(0)";}}
  onMouseLeave={(e)=>{ e.currentTarget.style.transform="translateY(0)";}}
  >{children}</button>
);

/* ---------------- Bottom HUD ---------------- */
const Hud = ({ items }) => (
  <div className="hud">
    {items.map((it) => (
      <div key={it.label} style={{ textAlign:"center", minWidth:64 }}>
        <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:12, color: it.color }}>
          {it.icon} {it.value}
        </div>
        <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:9, color:"#7d87ad",
          letterSpacing:1, marginTop:3, textTransform:"uppercase" }}>{it.label}</div>
      </div>
    ))}
  </div>
);

/* ---------------- Title screen ---------------- */
function TitleScreen({ onStart }) {
  const [diff, setDiff] = useState("normal");
  const [mode, setMode] = useState("region");
  const [region, setRegion] = useState(0);
  const [pool, setPool] = useState(8);
  return (
    <div className="screen" style={{ textAlign: "center" }}>
      <div className="poof" style={{ marginTop: 28 }}>
        <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#FFCB05",
          textShadow:"4px 4px 0 #2A6EBB, 0 0 30px rgba(255,203,5,.35)",
          fontSize:"clamp(34px,7vw,64px)", lineHeight:1.1 }}>
          POKÉ<br/>GAUNTLET
        </div>
        <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#fff",
          fontSize:"clamp(12px,2.4vw,18px)", marginTop:18, letterSpacing:2 }}>
          CAN YOU GO <span style={{color:"#6CF06C"}}>13-0</span>?
        </div>
        <div style={{ color:"#9aa6cf", fontSize:14, marginTop:14, maxWidth:560,
          margin:"14px auto 0", lineHeight:1.7, fontFamily:"'IBM Plex Mono', monospace" }}>
          Draft a squad of six from all 905 Pokémon across 8 generations.
          Then run the gauntlet — 8 Gym Leaders, the Elite Four, and the Champion.
          One loss ends the run.
        </div>
      </div>

      <div className="panel poof d1" style={{ maxWidth: 640, margin: "30px auto 0" }}>
        <div className="panelTitle">DIFFICULTY</div>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {Object.entries(DIFFS).map(([k, d]) => (
            <button key={k} onClick={() => setDiff(k)} className="chip"
              style={{
                borderColor: diff===k ? "#FFCB05" : "#2a3354",
                background: diff===k ? "rgba(255,203,5,.12)" : "rgba(255,255,255,.02)",
                color: diff===k ? "#FFCB05" : "#9aa6cf",
              }}>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:12 }}>{d.label}</div>
              <div style={{ fontSize:11, marginTop:6, fontFamily:"'IBM Plex Mono', monospace" }}>{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="panel poof d1" style={{ maxWidth: 640, margin: "16px auto 0" }}>
        <div className="panelTitle">DRAFT POOL — HOW MANY REGIONS? (ANIME ORDER)</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          {[8,7,6,5,4,3,2,1].map((n) => (
            <button key={n} onClick={() => setPool(n)} style={{
              fontFamily:"'Press Start 2P', monospace", fontSize:11, width:46, height:42,
              borderRadius:6, cursor:"pointer",
              border:`2px solid ${pool===n ? "#5BC8F5" : "#2a3354"}`,
              background: pool===n ? "#5BC8F5" : "transparent",
              color: pool===n ? "#0b0f1e" : "#9aa6cf",
              boxShadow: pool===n ? "0 0 16px #5BC8F566" : "none",
            }}>{n === 8 ? "ALL" : n}</button>
          ))}
        </div>
        <div style={{ textAlign:"center", color:"#5BC8F5", fontSize:11, marginTop:10,
          fontFamily:"'IBM Plex Mono', monospace" }}>
          {pool === 1 ? "Kanto only" : `Kanto → ${REGIONS[pool-1].name}`} · {DEX.filter((p)=>p.gen<=pool).length} Pokémon in the pool
        </div>
      </div>

      <div className="panel poof d2" style={{ maxWidth: 640, margin: "16px auto 0" }}>
        <div className="panelTitle">RUN MODE</div>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="chip" onClick={()=>setMode("region")} style={{
            borderColor: mode==="region" ? "#6CF06C" : "#2a3354",
            background: mode==="region" ? "rgba(108,240,108,.1)" : "rgba(255,255,255,.02)",
            color: mode==="region" ? "#6CF06C" : "#9aa6cf" }}>
            <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:12 }}>ONE REGION</div>
            <div style={{ fontSize:11, marginTop:6, fontFamily:"'IBM Plex Mono', monospace" }}>13 battles · go 13-0</div>
          </button>
          <button className="chip" onClick={()=>setMode("world")} style={{
            borderColor: mode==="world" ? "#F85888" : "#2a3354",
            background: mode==="world" ? "rgba(248,88,136,.1)" : "rgba(255,255,255,.02)",
            color: mode==="world" ? "#F85888" : "#9aa6cf" }}>
            <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:12 }}>WORLD TOUR</div>
            <div style={{ fontSize:11, marginTop:6, fontFamily:"'IBM Plex Mono', monospace" }}>all 8 regions · 104-0</div>
          </button>
        </div>
        {mode === "region" && (
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginTop:16 }}>
            {REGIONS.map((r, i) => (
              <button key={r.name} onClick={() => setRegion(i)} style={{
                fontFamily:"'Press Start 2P', monospace", fontSize:10, padding:"9px 12px",
                borderRadius:6, cursor:"pointer",
                border: `2px solid ${region===i ? r.color : "#2a3354"}`,
                background: region===i ? r.color : "transparent",
                color: region===i ? "#fff" : "#9aa6cf",
                boxShadow: region===i ? `0 0 16px ${r.color}66` : "none",
              }}>{r.name.toUpperCase()}</button>
            ))}
          </div>
        )}
      </div>

      <div className="poof d3" style={{ margin: "28px 0 40px" }}>
        <Btn big onClick={() => onStart({ diff, mode, region, pool })}>▶ START DRAFT</Btn>
      </div>
    </div>
  );
}

/* ---------------- Draft screen ---------------- */
const Reel = ({ label, options, value, landed, spinning, onSpin, disabled }) => {
  const [face, setFace] = useState(0);
  useEffect(() => {
    if (!spinning) return;
    const iv = setInterval(() => setFace((f) => (f + 1) % options.length), 70);
    return () => clearInterval(iv);
  }, [spinning, options.length]);
  const lockedOpt = options.find((o) => o.key === value);
  const isLocked = !!lockedOpt && !lockedOpt.any;
  const display = spinning
    ? options[face]
    : isLocked
      ? lockedOpt
      : landed || { label: "RANDOM", color: "#7d87ad" };
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:9, color:"#7d87ad", letterSpacing:2, marginBottom:6 }}>
        {label} {isLocked && !spinning && <span style={{ color:"#FFCB05" }}>🔒</span>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <div className={`reelWindow ${spinning ? "reelSpin" : ""}`} style={{
          borderColor: display.color,
          opacity: !spinning && !isLocked ? .8 : 1 }}>
          <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:10,
            color: display.color, filter: spinning ? "blur(1px)" : "none" }}>
            {display.label}
          </div>
        </div>
        <button onClick={onSpin} disabled={disabled || spinning} className="reelArrow"
          aria-label={`Randomize ${label.toLowerCase()} — costs one spin`}
          title={`Randomize ${label.toLowerCase()} (−1 spin)`}
          style={{ width:44, fontSize:15 }}>🎲</button>
      </div>
      <div className="reelHint" style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:10, color:"#7d87ad", marginTop:4 }}>
        {spinning ? "spinning…" : "🎲 = random (−1 spin)"}
      </div>
    </div>
  );
};

const EvolveControl = ({ p, tokens, onEvolve, compact }) => {
  const [choosing, setChoosing] = useState(false);
  if (!canEvolve(p)) return null;
  const branches = EVO[p.id];
  const go = (id) => { setChoosing(false); onEvolve(byId(id)); };
  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <button
        onClick={() => tokens > 0 && (branches.length === 1 ? go(branches[0]) : setChoosing(!choosing))}
        disabled={tokens <= 0}
        style={{ fontFamily:"'Press Start 2P', monospace", fontSize: compact ? 7 : 9,
          padding: compact ? "5px 7px" : "9px 12px", borderRadius:5,
          cursor: tokens > 0 ? "pointer" : "not-allowed",
          background: tokens > 0 ? "#B07CF5" : "#2a3354",
          color: tokens > 0 ? "#0b0f1e" : "#7d87ad", border:"none",
          boxShadow: tokens > 0 ? "0 0 14px #B07CF566" : "none" }}>
        🧬 EVOLVE
      </button>
      {choosing && (
        <div style={{ position:"absolute", bottom:"110%", left:"50%", transform:"translateX(-50%)",
          background:"#11172e", border:"2px solid #B07CF5", borderRadius:8, padding:8, zIndex:30,
          display:"flex", gap:6, boxShadow:"0 8px 30px rgba(0,0,0,.6)" }}>
          {branches.map((id) => (
            <button key={id} onClick={() => go(id)} style={{ background:"transparent", border:"1px solid #2a3354",
              borderRadius:6, cursor:"pointer", padding:4 }}>
              <Sprite id={id} size={44}/>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#cfd6f4", marginTop:2 }}>{byId(id).name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Modal = ({ onClose, children, border = "#FFCB05" }) => (
  <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(5,8,18,.85)", zIndex:100,
    display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(3px)" }}>
    <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" className="poof" style={{ background:"#11172e",
      border:`3px solid ${border}`, borderRadius:14, padding:22, maxWidth:560, width:"100%",
      maxHeight:"86vh", overflowY:"auto", position:"relative" }}>
      <button onClick={onClose} aria-label="Close" style={{ position:"absolute", top:6, right:6, background:"transparent",
        border:"none", color:"#9aa6cf", fontFamily:"'Press Start 2P', monospace", fontSize:14, cursor:"pointer",
        width:44, height:44 }}>✕</button>
      {children}
    </div>
  </div>
);

const teamAvg = (team) => ({
  lv: Math.round(team.reduce((s, p) => s + p.level, 0) / team.length),
  bst: Math.round(team.reduce((s, p) => s + p.bst, 0) / team.length),
});

const EvoCelebration = ({ oldP, newP, oldTeam, newTeam, onClose }) => {
  const oa = teamAvg(oldTeam), na = teamAvg(newTeam);
  return (
    <Modal onClose={onClose} border="#B07CF5">
      <div style={{ textAlign:"center", position:"relative", overflow:"hidden", borderRadius:10 }}>
        <div className="rays" style={{ opacity:.35 }}/>
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:14, color:"#B07CF5",
            textShadow:"0 0 18px #B07CF588" }} className="popin">
            🎉 CONGRATULATIONS!
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:13, color:"#cfd6f4", marginTop:8 }}>
            <b style={{ color:"#fff" }}>{oldP.name}</b> evolved into <b style={{ color:"#B07CF5" }}>{newP.name}</b>!
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, margin:"16px 0 6px" }}>
            <div style={{ opacity:.55 }}><Sprite id={oldP.id} size={76}/></div>
            <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:18, color:"#B07CF5" }}
              className="popin">→</div>
            <div className="spriteBounce"><Sprite id={newP.id} size={104} glow="#B07CF5"/></div>
          </div>
          <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:10, color:"#6CF06C", marginBottom:12 }}>
            LV.{oldP.level} → LV.{newP.level} <span style={{ color:"#6CF06C" }}>(+{newP.level - oldP.level})</span>
          </div>
        </div>
      </div>

      <div className="panelTitle" style={{ marginTop:6 }}>STAT INCREASES</div>
      {STAT_KEYS.map((k, i) => {
        const d = newP.stats[i] - oldP.stats[i];
        return (
          <div key={k} style={{ display:"flex", alignItems:"center", gap:8, margin:"4px 0" }}>
            <div style={{ width:42, fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#9aa6cf", textAlign:"right" }}>{k}</div>
            <div style={{ flex:1, height:9, background:"#1c2440", borderRadius:4, overflow:"hidden", position:"relative" }}>
              <div style={{ width:`${Math.min(100,(newP.stats[i]/200)*100)}%`, height:"100%", background:"#B07CF5", borderRadius:4 }}/>
              <div style={{ position:"absolute", inset:0, width:`${Math.min(100,(oldP.stats[i]/200)*100)}%`,
                background:"#6f56a3", borderRadius:4 }}/>
            </div>
            <div style={{ width:86, fontFamily:"'IBM Plex Mono', monospace", fontSize:11, color:"#cfd6f4" }}>
              {oldP.stats[i]}→<b style={{color:"#fff"}}>{newP.stats[i]}</b>{" "}
              <span style={{ color: d >= 0 ? "#6CF06C" : "#F85888" }}>({d >= 0 ? "+" : ""}{d})</span>
            </div>
          </div>
        );
      })}
      <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:12, color:"#9aa6cf",
        textAlign:"center", marginTop:12, padding:"10px", background:"rgba(8,11,24,.6)", borderRadius:8 }}>
        TEAM POWER: AVG LV <b style={{color:"#6CF06C"}}>{oa.lv} → {na.lv}</b>{" "}
        · AVG BST <b style={{color:"#6CF06C"}}>{oa.bst} → {na.bst}</b>{" "}
        <span style={{ color:"#B07CF5" }}>(+{na.bst - oa.bst})</span>
      </div>
      <div style={{ textAlign:"center", marginTop:14 }}>
        <Btn onClick={onClose} color="#B07CF5">CONTINUE</Btn>
      </div>
    </Modal>
  );
};

const HelpModal = ({ onClose, config }) => (
  <Modal onClose={onClose}>
    <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#FFCB05", fontSize:14, marginBottom:14, textAlign:"center" }}>
      HOW TO PLAY
    </div>
    {[
      ["🎯 OBJECTIVE", "Draft 6 Pokémon, then run the gauntlet: 8 Gym Leaders, the Elite Four, and the Champion. One loss ends the run. Go 13-0 (or 104-0 on World Tour)."],
      ["🎰 THE SPIN", "Your first spin each pick is FREE and fully random — region and type spin too. Every spin after that costs 1 reroll."],
      ["🎚 THE REELS", "You can't pick a region or type — each reel has its own 🎲. Spinning a reel randomizes JUST that slot, locks the result, and respins your Pokémon (−1 spin). The main spin randomizes everything at once."],
      ["🧬 EVO TOKENS", "Spend a token to evolve an eligible Pokémon (e.g. Charmeleon → Charizard), boosting its stats and level instantly. Earn +1 token for every Gym you defeat on Easy and Normal. No tokens on Hard."],
      ["🔄 TOKEN TRADE", "No eligible evolutions? Trade tokens for extra spins instead."],
      ["⇄ REPLACEMENT SPINS", "Every Gym you defeat awards a Replacement Spin: roll one random Pokémon between battles and swap it into your squad — or discard it."],
      ["⚔ BATTLES", "Outcomes come from real type matchups + base stats + a little luck. Watch your odds bar — and use the Team Report to spot blind spots before you enter."],
    ].map(([h, t]) => (
      <div key={h} style={{ marginBottom:12 }}>
        <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:10, color:"#6CF06C", marginBottom:5 }}>{h}</div>
        <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:13, color:"#cfd6f4", lineHeight:1.6 }}>{t}</div>
      </div>
    ))}
    <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:12, color:"#9aa6cf", textAlign:"center", marginTop:14 }}>
      {DIFFS[config.diff].label} MODE: {DIFFS[config.diff].desc}
    </div>
  </Modal>
);

const DexModal = ({ p, onClose }) => {
  const e = DEX_ENTRIES[p.id - 1];
  return (
    <Modal onClose={onClose} border={TYPE_COLORS[p.types[0]]}>
      <div style={{ display:"flex", gap:18, alignItems:"center", flexWrap:"wrap", justifyContent:"center" }}>
        <Sprite id={p.id} size={132} glow={TYPE_COLORS[p.types[0]]}/>
        <div style={{ flex:"1 1 220px" }}>
          <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:12, color:"#9aa6cf" }}>
            #{String(p.id).padStart(3, "0")} · {REGIONS[p.gen-1].name.toUpperCase()}
          </div>
          <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:16, color:"#fff", margin:"6px 0" }}>
            {p.name.toUpperCase()}
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:13, color:TYPE_COLORS[p.types[0]], marginBottom:8 }}>
            {e.genus}
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
            {p.types.map((t) => <TypeBadge key={t} t={t} size={9}/>)}
            <TierBadge bst={p.bst} size={9}/>
            <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:9, color:"#6CF06C" }}>LV.{p.level}</span>
          </div>
        </div>
      </div>
      <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:14, color:"#cfd6f4", lineHeight:1.75,
        marginTop:16, padding:"14px 16px", background:"rgba(8,11,24,.7)", borderRadius:10,
        borderLeft:`4px solid ${TYPE_COLORS[p.types[0]]}` }}>
        {e.flavor || "Data on this Pokémon is still being compiled by researchers."}
      </div>
      <div style={{ marginTop:14 }}>
        {STAT_KEYS.map((k, i) => <StatBar key={k} label={k} value={p.stats[i]} compact/>)}
      </div>
      {canEvolve(p) && (
        <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:12, color:"#B07CF5", marginTop:10, textAlign:"center" }}>
          🧬 Can evolve into {EVO[p.id].map((id) => byId(id).name).join(" / ")}
        </div>
      )}
    </Modal>
  );
};

function DraftScreen({ config, onDone, tokens, setTokens }) {
  const diff = DIFFS[config.diff];
  const [team, setTeam] = useState([]);
  const [genF, setGenF] = useState(0);
  const [typeF, setTypeF] = useState("");
  const [current, setCurrent] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [rollFace, setRollFace] = useState(null);
  const [rerolls, setRerolls] = useState(diff.rerolls);
  const [rolledOnce, setRolledOnce] = useState(false);
  const [revealFx, setRevealFx] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [dexOpen, setDexOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [celeb, setCeleb] = useState(null);
  const [reelSpin, setReelSpin] = useState(null);   // 'region' | 'type' while a single reel spins
  const [lastSpin, setLastSpin] = useState("all");  // 'all' = main spin animates unlocked reels
  const timers = useRef([]);
  const busy = rolling || !!reelSpin;

  const poolRegions = REGIONS.slice(0, config.pool || 8);
  const regionOptions = [{ key:0, label:"ANY REGION", color:"#9aa6cf", any:true },
    ...poolRegions.map((r) => ({ key:r.gen, label:r.name.toUpperCase(), color:r.color }))];
  const typeOptions = [{ key:"", label:"ANY TYPE", color:"#9aa6cf", any:true },
    ...TYPES.map((t) => ({ key:t, label:t.toUpperCase(), color:TYPE_COLORS[t] }))];

  const filterPool = (g, ty) => DEX.filter((p) =>
    p.gen <= (config.pool || 8) &&
    (g === 0 || p.gen === g) &&
    (ty === "" || p.types.includes(ty)) &&
    !team.some((t) => t.id === p.id)
  );
  const pool = useMemo(() => filterPool(genF, typeF), [genF, typeF, team, config.pool]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clearTimers, []);

  const doSpin = (paid, g, ty) => {
    const livePool = filterPool(g, ty);
    if (rolling || livePool.length === 0) return;
    if (paid) {
      if (rerolls <= 0) return;
      setRerolls((r) => r - 1);
    }
    setRolling(true);
    setCurrent(null);
    setRevealFx(false);
    const final = pick(livePool);
    let t = 0;
    const steps = 16;
    for (let i = 0; i < steps; i++) {
      t += 42 + i * 13;
      timers.current.push(setTimeout(() => setRollFace(pick(livePool)), t));
    }
    timers.current.push(setTimeout(() => {
      setRollFace(null);
      setCurrent(final);
      setRolling(false);
      setRolledOnce(true);
      setRevealFx(true);
      timers.current.push(setTimeout(() => setRevealFx(false), 1200));
    }, t + 180));
  };

  /* main spin — EVERYTHING randomized: both reels unlock and land wherever fate says */
  const spin = (paid) => {
    if (busy) return;
    setLastSpin("all");
    setGenF(0); setTypeF("");
    doSpin(paid, 0, "");
  };

  /* reel spins — ONLY the pressed reel animates; it lands first, then the Pokémon respins */
  const spinOneReel = (kind) => {
    if (!rolledOnce || busy || rerolls <= 0) return;
    const valid = kind === "region"
      ? poolRegions.filter((r) => filterPool(r.gen, typeF).length > 0).map((r) => r.gen)
      : TYPES.filter((t) => filterPool(genF, t).length > 0);
    if (!valid.length) return;
    setRerolls((r) => r - 1);
    setLastSpin("reel");
    setReelSpin(kind);
    setCurrent(null);
    setRevealFx(false);
    timers.current.push(setTimeout(() => {
      const v = valid[Math.floor(Math.random() * valid.length)];
      if (kind === "region") { setGenF(v); setReelSpin(null); doSpin(false, v, typeF); }
      else { setTypeF(v); setReelSpin(null); doSpin(false, genF, v); }
    }, 850));
  };
  const spinRegionReel = () => spinOneReel("region");
  const spinTypeReel = () => spinOneReel("type");

  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeQty, setTradeQty] = useState(1);
  const openTrade = () => {
    if (tokens <= 0 || rolling) return;
    setTradeQty(1);
    setTradeOpen(true);
  };
  const confirmTrade = () => {
    const q = Math.min(tradeQty, tokens);
    setTokens((t) => t - q);
    setRerolls((r) => r + q);
    setTradeOpen(false);
  };

  const lockIn = () => {
    if (!current) return;
    const next = [...team, current];
    setCurrent(null);
    setRolledOnce(false);
    setRerolls(diff.rerolls);
    setGenF(0); setTypeF("");
    if (next.length === 6) onDone(next);
    else setTeam(next);
  };

  const shown = rollFace || current;
  const slot = team.length + 1;
  const isShiny = current && (tierOf(current.bst) === "S" || current.leg);

  return (
    <div className="screen hasHud">
      <Hud items={[
        { icon:"🎰", value: rerolls, label:"spins left", color:"#6CF06C" },
        { icon:"🧬", value: tokens, label:"evo tokens", color:"#B07CF5" },
        { icon:"📋", value:`${slot}/6`, label:"pick", color:"#FFCB05" },
        { icon:"🌍", value: config.pool===8?"ALL":config.pool, label:"regions", color:"#5BC8F5" },
      ]}/>
      {celeb && <EvoCelebration {...celeb} onClose={() => setCeleb(null)}/>}
      {dexOpen && current && <DexModal p={current} onClose={() => setDexOpen(false)}/>}
      {helpOpen && <HelpModal config={config} onClose={() => setHelpOpen(false)}/>}
      {tradeOpen && (
        <Modal onClose={() => setTradeOpen(false)} border="#B07CF5">
          <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#B07CF5", fontSize:13,
            textAlign:"center", marginBottom:8 }}>🧬 TRADE TOKENS</div>
          <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:13, color:"#cfd6f4",
            textAlign:"center", lineHeight:1.6, marginBottom:18 }}>
            How many Evolution Tokens do you want to<br/>trade for extra spins? (1 token = 1 spin)
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:18, marginBottom:8 }}>
            <button className="qtyBtn" aria-label="Trade one fewer token" onClick={() => setTradeQty((q) => Math.max(1, q - 1))} disabled={tradeQty <= 1}>−</button>
            <div style={{ textAlign:"center", minWidth:90 }}>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:30, color:"#fff" }}>{tradeQty}</div>
              <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:11, color:"#9aa6cf", marginTop:4 }}>
                of {tokens} token{tokens > 1 ? "s" : ""}
              </div>
            </div>
            <button className="qtyBtn" aria-label="Trade one more token" onClick={() => setTradeQty((q) => Math.min(tokens, q + 1))} disabled={tradeQty >= tokens}>+</button>
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:12, color:"#6CF06C",
            textAlign:"center", marginBottom:18 }}>
            → you'll gain {tradeQty} extra spin{tradeQty > 1 ? "s" : ""} this pick
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn onClick={confirmTrade} color="#B07CF5">✔ TRADE {tradeQty}</Btn>
            <Btn ghost onClick={() => setTradeOpen(false)} color="#9aa6cf">CANCEL</Btn>
          </div>
        </Modal>
      )}

      <div style={{ textAlign:"center", marginTop:18, position:"relative" }}>
        <button onClick={() => setHelpOpen(true)} title="How to play" aria-label="How to play"
          className="helpBtn" style={{
          position:"absolute", right:6, top:0, width:44, height:44, borderRadius:"50%",
          fontFamily:"'Press Start 2P', monospace", fontSize:14, cursor:"pointer",
          background:"transparent", color:"#FFCB05", border:"2px solid #FFCB05",
          boxShadow:"0 0 12px #FFCB0533" }}>?</button>
        <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#FFCB05", fontSize:"clamp(14px,4.4vw,18px)" }}>
          DRAFT — PICK {slot}/6
        </div>
        <div className="metaRow" style={{ color:"#9aa6cf", fontFamily:"'IBM Plex Mono', monospace", fontSize:12, marginTop:8,
          display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <span>{DIFFS[config.diff].label} MODE</span>
          <span>POOL <b style={{color:"#5BC8F5"}}>{config.pool===8?"ALL":config.pool} REGION{(config.pool||8)>1?"S":""}</b></span>
          <span>SPINS <b style={{color:"#6CF06C"}}>{rerolls}</b></span>
          <span>🧬 TOKENS <b style={{color:"#B07CF5"}}>{tokens}</b></span>
        </div>
      </div>

      {/* reels — each with its own randomizer, no picking allowed */}
      <div className="reelsRow" style={{ display:"flex", gap:26, justifyContent:"center", marginTop:18, flexWrap:"wrap" }}>
        <Reel label="REGION REEL" options={regionOptions} value={genF}
          landed={current ? { label: REGIONS[current.gen-1].name.toUpperCase(), color: REGIONS[current.gen-1].color } : null}
          spinning={reelSpin === "region" || (rolling && lastSpin === "all" && genF === 0)}
          onSpin={spinRegionReel}
          disabled={!rolledOnce || rerolls <= 0 || busy}/>
        <Reel label="TYPE REEL" options={typeOptions} value={typeF}
          landed={current ? { label: current.types[0].toUpperCase(), color: TYPE_COLORS[current.types[0]] } : null}
          spinning={reelSpin === "type" || (rolling && lastSpin === "all" && typeF === "")}
          onSpin={spinTypeReel}
          disabled={!rolledOnce || rerolls <= 0 || busy}/>
      </div>
      <div className="spinHint" style={{ textAlign:"center", color:"#7d87ad", fontSize:11, marginTop:8, fontFamily:"'IBM Plex Mono', monospace" }}>
        {!rolledOnce
          ? "first spin is free — everything is random, reels included"
          : rerolls > 0
            ? `🎲 a reel to randomize just that slot (−1 spin) · the main spin randomizes everything`
            : "no spins left — lock in, evolve, or trade a token"}
      </div>

      {/* roll stage + stats */}
      <div style={{ display:"flex", justifyContent:"center", marginTop: 16, gap: 16, flexWrap:"wrap", alignItems:"stretch" }}>
        <div className={`stage ${revealFx ? "stageShake" : ""}`} style={{
          position:"relative", overflow:"hidden",
          borderColor: shown && !rolling ? (TYPE_COLORS[shown.types[0]]) : "#2a3354",
          boxShadow: shown && !rolling ? `0 0 40px ${TYPE_COLORS[shown.types[0]]}44, inset 0 0 60px rgba(0,0,0,.5)` : "inset 0 0 60px rgba(0,0,0,.5)",
        }}>
          {revealFx && <div className="flashfx"/>}
          {isShiny && !rolling && <div className="rays"/>}
          {isShiny && !rolling && ["12%","78%","30%","65%"].map((l, i) => (
            <span key={i} className="spark" style={{ left:l, animationDelay:`${i*.25}s` }}>✦</span>
          ))}
          {shown ? (
            <div style={{ textAlign:"center", position:"relative", zIndex:2 }} className={!rolling ? "settle" : ""}>
              <div onClick={() => { setBouncing(true); setTimeout(() => setBouncing(false), 500); }}
                style={{ display:"inline-block", cursor:"pointer" }} className="hoverWiggle">
                <Sprite id={shown.id} size={150} glow={!rolling ? TYPE_COLORS[shown.types[0]] : null} bounce={bouncing}/>
              </div>
              <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#fff",
                fontSize: 15, marginTop: 4, opacity: rolling ? .5 : 1 }}>
                {shown.name.toUpperCase()}
              </div>
              {!rolling && (
                <>
                  <div className="popin" style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:11,
                    color: REGIONS[shown.gen-1].color, marginTop:3, letterSpacing:1 }}>
                    {REGIONS[shown.gen-1].name.toUpperCase()} REGION
                  </div>
                  <div style={{ display:"flex", gap:6, justifyContent:"center", alignItems:"center", marginTop:7, flexWrap:"wrap" }}>
                    {shown.types.map((t, i) => <span key={t} className="popin" style={{ animationDelay:`${.08*i}s` }}><TypeBadge t={t}/></span>)}
                    <span className="popin" style={{ animationDelay:".16s" }}><TierBadge bst={shown.bst} size={10}/></span>
                    <span className="popin" style={{ animationDelay:".24s", fontFamily:"'Press Start 2P', monospace", fontSize:10, color:"#6CF06C" }}>LV.{shown.level}</span>
                    {shown.leg && <span className="popin" style={{ animationDelay:".32s", fontFamily:"'Press Start 2P', monospace", fontSize:9, color:"#FFCB05" }}>★ LEGEND</span>}
                  </div>
                  <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:10, flexWrap:"wrap" }}>
                    <button onClick={() => setDexOpen(true)} style={{
                      fontFamily:"'Press Start 2P', monospace", fontSize:8, padding:"7px 10px",
                      background:"transparent", color:"#5BC8F5", border:"2px solid #5BC8F5",
                      borderRadius:5, cursor:"pointer" }}>📖 DEX ENTRY</button>
                    {current && <EvolveControl p={current} tokens={tokens}
                      onEvolve={(np) => { setTokens((t) => t - 1);
                        setCeleb({ oldP: current, newP: np, oldTeam: [...team, current], newTeam: [...team, np] });
                        setCurrent(np); }}/>}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ color:"#7d87ad", fontFamily:"'Press Start 2P', monospace", fontSize:12, textAlign:"center", lineHeight:2 }}>
              {reelSpin ? `${reelSpin === "region" ? "REGION" : "TYPE"} REEL\nSPINNING…`.split("\n").map((l,i)=><div key={i}>{l}</div>)
                : pool.length === 0 ? "NO POKÉMON MATCH REELS" : "PRESS SPIN"}
            </div>
          )}
        </div>

        <div className="panel" style={{ width:"min(320px,92vw)", display:"flex", flexDirection:"column", justifyContent:"center",
          borderColor: current && !rolling ? TYPE_COLORS[current.types[0]] : "#2a3354" }}>
          <div className="panelTitle">BASE STATS</div>
          {current && !rolling ? (
            <>
              {STAT_KEYS.map((k, i) => <StatBar key={k} label={k} value={current.stats[i]}/>)}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:10,
                fontFamily:"'IBM Plex Mono', monospace", fontSize:12, color:"#9aa6cf" }}>
                <span>TOTAL <b style={{color:"#fff"}}>{current.bst}</b></span>
                <span>GEN {current.gen}</span>
                <span>LV.<b style={{color:"#6CF06C"}}>{current.level}</b></span>
              </div>
            </>
          ) : (
            <div style={{ color:"#5f6a96", fontFamily:"'Press Start 2P', monospace", fontSize:9,
              textAlign:"center", lineHeight:2.2 }}>SPIN TO REVEAL<br/>STATS</div>
          )}
        </div>
      </div>

      {/* actions */}
      <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop: 18, flexWrap:"wrap" }}>
        {!rolledOnce ? (
          <Btn big onClick={() => spin(false)} disabled={busy || pool.length===0}>🎰 SPIN (FREE)</Btn>
        ) : (
          <>
            <Btn onClick={() => spin(true)} disabled={busy || rerolls<=0 || pool.length===0} color="#F85888">
              🎰 SPIN ({rerolls})
            </Btn>
            <Btn onClick={openTrade} disabled={busy || tokens<=0} color="#B07CF5">
              🧬→🎰 TRADE ({tokens})
            </Btn>
            <Btn big cls="primaryAction" onClick={lockIn} disabled={busy || !current} color="#6CF06C">
              ✔ LOCK IN
            </Btn>
          </>
        )}
      </div>

      {/* team strip */}
      <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop: 24, marginBottom: 36, flexWrap:"wrap" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="slot" style={{ height:"auto", minHeight:96, padding:"8px 4px",
            borderColor: team[i] ? TYPE_COLORS[team[i].types[0]] : "#2a3354" }}>
            {team[i] ? (
              <>
                <Sprite id={team[i].id} size={56}/>
                <div style={{ fontSize:9, color:"#cfd6f4", fontFamily:"'Press Start 2P', monospace",
                  marginTop:2, maxWidth:84, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {team[i].name}
                </div>
                <div style={{ fontSize:9, color:TIER_COLORS[tierOf(team[i].bst)], fontFamily:"'Press Start 2P', monospace", marginTop:2 }}>
                  {tierOf(team[i].bst)} · LV.{team[i].level}
                </div>
                <div style={{ marginTop:4 }}>
                  <EvolveControl compact p={team[i]} tokens={tokens}
                    onEvolve={(np) => { setTokens((t) => t - 1);
                      const nt = team.map((m, j) => j === i ? np : m);
                      setCeleb({ oldP: team[i], newP: np, oldTeam: team, newTeam: nt });
                      setTeam(nt); }}/>
                </div>
              </>
            ) : (
              <div style={{ color:"#5f6a96", fontFamily:"'Press Start 2P', monospace", fontSize:16 }}>{i+1}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Team report ---------------- */
const teamRating = (team) => {
  const avgLevel = team.reduce((s, p) => s + p.level, 0) / 6;
  const covered = TYPES.filter((d) =>
    team.some((p) => p.types.some((t) => eff(t, [d]) >= 2))
  );
  const score = Math.round(avgLevel * 0.74 + (covered.length / 18) * 100 * 0.26);
  const grade = score >= 85 ? "S" : score >= 74 ? "A" : score >= 62 ? "B" : score >= 50 ? "C" : "D";
  const blind = TYPES.filter((d) => !covered.includes(d));
  return { score, grade, covered, blind, avgLevel: Math.round(avgLevel) };
};

function TeamReportScreen({ config, team, setTeam, tokens, setTokens, onEnter }) {
  const [celeb, setCeleb] = useState(null);
  const r = teamRating(team);
  const avgStats = STAT_KEYS.map((_, i) =>
    Math.round(team.reduce((s, p) => s + p.stats[i], 0) / 6)
  );
  const target = config.mode === "world" ? "104-0" : "13-0";
  return (
    <div className="screen hasHud" style={{ textAlign:"center" }}>
      {celeb && <EvoCelebration {...celeb} onClose={() => setCeleb(null)}/>}
      <Hud items={[
        { icon:"🏅", value: r.grade, label:"team grade", color: TIER_COLORS[r.grade] },
        { icon:"🧬", value: tokens, label:"evo tokens", color:"#B07CF5" },
        { icon:"📊", value: r.avgLevel, label:"avg level", color:"#6CF06C" },
        { icon:"🛡", value:`${r.covered.length}/18`, label:"coverage", color:"#5BC8F5" },
      ]}/>
      <div className="poof" style={{ marginTop:24 }}>
        <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#FFCB05", fontSize:18 }}>TEAM REPORT</div>
        <div style={{ color:"#9aa6cf", fontFamily:"'IBM Plex Mono', monospace", fontSize:12, marginTop:8 }}>
          scouting complete · the gauntlet awaits
        </div>
      </div>

      <div className="panel poof d1" style={{ maxWidth:720, margin:"20px auto 0",
        borderColor: TIER_COLORS[r.grade] }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:24, flexWrap:"wrap" }}>
          <div style={{ width:120, height:120, borderRadius:"50%",
            border:`5px solid ${TIER_COLORS[r.grade]}`, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            boxShadow:`0 0 36px ${TIER_COLORS[r.grade]}55`, flexShrink:0 }}>
            <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:34, color:TIER_COLORS[r.grade] }}>{r.grade}</div>
            <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:13, color:"#cfd6f4", marginTop:4 }}>{r.score}/100</div>
          </div>
          <div style={{ flex:"1 1 280px", maxWidth:340, textAlign:"left" }}>
            <div className="panelTitle" style={{ textAlign:"left" }}>TEAM AVERAGES</div>
            {STAT_KEYS.map((k, i) => <StatBar key={k} label={k} value={avgStats[i]} compact/>)}
            <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:12, color:"#9aa6cf", marginTop:8 }}>
              AVG LEVEL <b style={{ color:"#6CF06C" }}>{r.avgLevel}</b> · TYPE COVERAGE <b style={{ color:"#fff" }}>{r.covered.length}/18</b> · 🧬 <b style={{ color:"#B07CF5" }}>{tokens}</b>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap", marginTop:18 }}>
          {team.map((p, i) => (
            <div key={p.id} style={{ width:96 }}>
              <Sprite id={p.id} size={74} glow={TYPE_COLORS[p.types[0]]}/>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:9, color:"#cfd6f4",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:9, color:TIER_COLORS[tierOf(p.bst)] }}>
                {tierOf(p.bst)} · LV.{p.level}
              </div>
              <div style={{ marginTop:4 }}>
                <EvolveControl compact p={p} tokens={tokens}
                  onEvolve={(np) => { setTokens((t) => t - 1);
                    const nt = team.map((m, j) => j === i ? np : m);
                    setCeleb({ oldP: p, newP: np, oldTeam: team, newTeam: nt });
                    setTeam(nt); }}/>
              </div>
            </div>
          ))}
        </div>

        {r.blind.length > 0 && (
          <div style={{ marginTop:16 }}>
            <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:9, color:"#F85888", marginBottom:8 }}>
              ⚠ NO SUPER-EFFECTIVE ANSWER VS:
            </div>
            <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap" }}>
              {r.blind.map((t) => <TypeBadge key={t} t={t} size={9}/>)}
            </div>
          </div>
        )}
      </div>

      <div className="poof d2" style={{ margin:"26px 0 40px" }}>
        <Btn big onClick={onEnter} color="#6CF06C">⚔ ENTER THE GAUNTLET — GO {target}</Btn>
      </div>
    </div>
  );
}

/* ---------------- Gauntlet / Battle screen ---------------- */
function GauntletScreen({ config, team, setTeam, tokens, setTokens, onFinish }) {
  const regionList = config.mode === "world" ? REGIONS : [REGIONS[config.region]];
  const [regionIdx, setRegionIdx] = useState(0);
  const [battleIdx, setBattleIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [phase, setPhase] = useState("intro"); // intro | fight | verdict | regionClear
  const [log, setLog] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [fast, setFast] = useState(config.mode === "world");
  const [celeb, setCeleb] = useState(null);
  const [repSpins, setRepSpins] = useState(0);
  const [repMon, setRepMon] = useState(null);
  const [repRolling, setRepRolling] = useState(false);
  const timers = useRef([]);
  const fastRef = useRef(fast);
  fastRef.current = fast;

  const region = regionList[regionIdx];
  const leader = region.bosses[battleIdx];
  const badges = results.filter((r) => r.win).length;
  const expBonus = Math.min(badges * 5, 130);
  const diffMult = DIFFS[config.diff].bossMult;
  const bteam = useMemo(() => bossTeam(leader, battleIdx, region.gen), [leader, battleIdx, region.gen]);
  const prob = winProb(team, bteam, battleIdx, diffMult, expBonus);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clearTimers, []);
  const wait = (ms) => (fastRef.current ? ms * 0.28 : ms);

  const startFight = useCallback(() => {
    clearTimers();
    setPhase("fight");
    setLog([]);
    const win = Math.random() < prob;
    setOutcome(win);

    const aceP = byId(leader.ace);
    const sorted = [...team].map((p) => ({ p, s: pokeScore(p, bteam) })).sort((a,b)=>b.s-a.s);
    const mvp = sorted[0].p;
    const second = sorted[1].p;
    const weakest = sorted[sorted.length-1].p;

    const KO = ["fainted!", "is down!", "can't continue!"];
    const atkLine = (a, d) => {
      const best = [...a.types].sort((x, y) => eff(y, d.types) - eff(x, d.types))[0];
      const m = eff(best, d.types);
      const mv = pick(MOVES[best]);
      if (m >= 2) return { t:`${a.name.toUpperCase()}'s ${mv} slams ${d.name.toUpperCase()} — SUPER EFFECTIVE!`, c:"#6CF06C" };
      if (m === 0) return { t:`${d.name.toUpperCase()} is immune to ${a.name.toUpperCase()}'s ${mv}...`, c:"#F85888" };
      if (m < 1) return { t:`${a.name.toUpperCase()}'s ${mv} barely scratches ${d.name.toUpperCase()}...`, c:"#F4A95C" };
      return { t:`${a.name.toUpperCase()} hits ${d.name.toUpperCase()} with ${mv}!`, c:"#fff" };
    };
    const counterLine = (m, target) => {
      const mt = pick(m.types);
      const mv = pick(MOVES[mt]);
      const e = eff(mt, target.types);
      if (e >= 2) return { t:`${m.name.toUpperCase()} retaliates with ${mv} — ${target.name.toUpperCase()} is hurt badly!`, c:"#F85888" };
      if (e === 0) return { t:`${target.name.toUpperCase()} shrugs off ${m.name.toUpperCase()}'s ${mv}!`, c:"#cfd6f4" };
      if (e < 1) return { t:`${m.name.toUpperCase()}'s ${mv} glances off ${target.name.toUpperCase()}!`, c:"#cfd6f4" };
      return { t:`${m.name.toUpperCase()} counters with ${mv}!`, c:"#F4A95C" };
    };

    const lines = [];
    const rotation = [...team].sort(() => Math.random() - 0.5); // all 6 of YOUR Pokémon take turns
    const mentioned = new Set();
    let rot = 0;
    const n = bteam.length;
    // distribute your 6 attackers across their whole squad
    const beats = bteam.map((_, i) => Math.floor(6 / n) + (i < 6 % n ? 1 : 0));
    // win: every enemy member goes down · loss: you fall partway (usually at the ace)
    const koCount = win ? n : Math.max(1, n - 1 - (Math.random() < 0.35 ? Math.floor(Math.random() * (n - 1)) : 0));

    for (let i = 0; i < n; i++) {
      const m = bteam[i];
      lines.push({ t:`${leader.name.toUpperCase()} sends out ${m.name.toUpperCase()}${i === n - 1 ? " — THE ACE" : ""}!`, c:"#9aa6cf" });
      if (i < koCount) {
        for (let b = 0; b < Math.max(1, beats[i]); b++) {
          const a = rotation[rot++ % 6];
          mentioned.add(a.id);
          lines.push(atkLine(a, m));
          if (b === 0 && Math.random() < 0.5) {
            const target = rotation[rot % 6];
            mentioned.add(target.id);
            lines.push(counterLine(m, target));
          }
        }
        lines.push({ t:`${m.name.toUpperCase()} ${pick(KO)}`, c:"#6CF06C" });
      } else {
        const a = rotation[rot++ % 6];
        mentioned.add(a.id);
        lines.push(atkLine(a, m));
        lines.push({ t:`${m.name.toUpperCase()} unleashes everything!`, c:"#F85888" });
        const rest = team.filter((p) => !mentioned.has(p.id));
        if (rest.length)
          lines.push({ t:`${rest.map((p) => p.name.toUpperCase()).join(", ")} rush in — but it's not enough!`, c:"#F85888" });
        const reserves = bteam.slice(i + 1);
        lines.push({ t:`Your squad is wiped out...${reserves.length ? ` ${leader.name.toUpperCase()} never even needed ${reserves.map((x) => x.name.toUpperCase()).join(" and ")}.` : ""}`, c:"#F85888" });
        break;
      }
    }
    if (win) {
      lines.push({ t:`${leader.name.toUpperCase()} is out of Pokémon!`, c:"#6CF06C" });
      if (leader.role === "GYM" && DIFFS[config.diff].tokenPerGym)
        lines.push({ t:`🧬 Evolution Token earned!`, c:"#B07CF5" });
      if (leader.role === "GYM")
        lines.push({ t:`🔄 Replacement Spin earned!`, c:"#5BC8F5" });
    }

    let t = 350;
    lines.forEach((ln) => {
      timers.current.push(setTimeout(() => setLog((l) => [...l, ln]), wait(t)));
      t += 500;
    });
    timers.current.push(setTimeout(() => setPhase("verdict"), wait(t + 350)));
  }, [prob, leader, team, bteam]);

  const skipFight = () => {
    clearTimers();
    setLog((l) => l); // keep whatever rendered
    setPhase("verdict");
  };

  const advance = () => {
    clearTimers();
    const rec = { region: region.name, color: region.color, leader: leader.name,
      role: leader.role, type: leader.type, ace: leader.ace, win: outcome };
    const newResults = [...results, rec];
    setResults(newResults);

    if (!outcome) { onFinish(newResults, false); return; }

    // gym rewards: evo token (easy/normal) + a replacement spin (all difficulties)
    if (leader.role === "GYM") {
      if (DIFFS[config.diff].tokenPerGym) setTokens((t) => t + 1);
      setRepSpins((s) => s + 1);
    }

    if (battleIdx === 12) {
      if (regionIdx === regionList.length - 1) { onFinish(newResults, true); return; }
      setPhase("regionClear");
      return;
    }
    setBattleIdx(battleIdx + 1);
    setPhase("intro");
    setLog([]); setOutcome(null);
  };

  const nextRegion = () => {
    setRegionIdx(regionIdx + 1);
    setBattleIdx(0);
    setPhase("intro");
    setLog([]); setOutcome(null);
  };

  // auto-advance in fast mode
  useEffect(() => {
    if (!fast) return;
    if (phase === "intro") timers.current.push(setTimeout(startFight, 650));
    if (phase === "verdict" && outcome) timers.current.push(setTimeout(advance, 900));
  }, [phase, fast]); // eslint-disable-line

  const aceP = byId(leader.ace);
  const roleLabel = leader.role === "GYM" ? `GYM ${battleIdx+1}` : leader.role === "ELITE" ? `ELITE FOUR ${battleIdx-7}` : "CHAMPION";
  const wins = results.filter(r=>r.win).length;

  if (phase === "regionClear") {
    return (
      <div className="screen" style={{ textAlign:"center" }}>
        <div className="poof" style={{ marginTop:70 }}>
          <div style={{ fontSize:64 }}>🏆</div>
          <div style={{ fontFamily:"'Press Start 2P', monospace", color: region.color,
            fontSize:26, marginTop:14, textShadow:`0 0 24px ${region.color}88` }}>
            {region.name.toUpperCase()} CLEARED!
          </div>
          <div style={{ color:"#9aa6cf", fontFamily:"'IBM Plex Mono', monospace", marginTop:14, fontSize:14 }}>
            {wins}-0 so far · next stop: {regionList[regionIdx+1].name}
          </div>
          <div style={{ marginTop:30 }}>
            <Btn big onClick={nextRegion} color={regionList[regionIdx+1].color}>
              ENTER {regionList[regionIdx+1].name.toUpperCase()} →
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen hasHud">
      {celeb && <EvoCelebration {...celeb} onClose={() => setCeleb(null)}/>}
      <Hud items={[
        { icon:"🏆", value:`${wins}-0`, label:"record", color:"#6CF06C" },
        { icon:"⚔", value:`${battleIdx+1}/13`, label:"battle", color:"#FFCB05" },
        { icon:"🧬", value: tokens, label:"evo tokens", color:"#B07CF5" },
        { icon:"🔄", value: repSpins, label:"swap spins", color:"#5BC8F5" },
      ]}/>
      {/* progress header */}
      <div style={{ maxWidth: 860, margin: "16px auto 0", padding: "0 8px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div style={{ fontFamily:"'Press Start 2P', monospace", color: region.color, fontSize:"clamp(10px,3vw,13px)" }}>
            {region.name.toUpperCase()} {config.mode==="world" && `(${regionIdx+1}/8)`}
          </div>
          <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#6CF06C", fontSize:"clamp(10px,3vw,13px)" }}>
            {wins}-0 <span style={{ color:"#B07CF5", marginLeft:10 }}>🧬{tokens}</span>{repSpins > 0 && <span style={{ color:"#5BC8F5", marginLeft:10 }}>🔄{repSpins}</span>}
          </div>
          <button onClick={()=>setFast(!fast)} aria-pressed={fast} aria-label="Toggle fast forward" style={{
            fontFamily:"'Press Start 2P', monospace", fontSize:9, padding:"7px 10px",
            background: fast ? "#FFCB05" : "transparent", color: fast ? "#0b0f1e" : "#9aa6cf",
            border:"2px solid " + (fast ? "#FFCB05" : "#2a3354"), borderRadius:5, cursor:"pointer" }}>
            ⏩ FAST {fast ? "ON" : "OFF"}
          </button>
        </div>
        <div style={{ display:"flex", gap:4, marginTop:10 }}>
          {region.bosses.map((b, i) => {
            const done = i < battleIdx;
            const cur = i === battleIdx;
            return (
              <div key={i} title={b.name} style={{
                flex:1, height:8, borderRadius:3,
                background: done ? "#6CF06C" : cur ? "#FFCB05" : "#1c2440",
                boxShadow: cur ? "0 0 10px #FFCB05" : "none",
                outline: i===12 ? "1px solid #FFCB05" : i>=8 ? "1px solid #F85888" : "none",
              }}/>
            );
          })}
        </div>
      </div>

      {/* face-off card */}
      <div className="panel" style={{ maxWidth: 860, margin: "18px auto 0",
        borderColor: leader.role==="CHAMPION" ? "#FFCB05" : TYPE_COLORS[leader.type] }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          {/* your side */}
          <div style={{ display:"flex", gap:2, flexWrap:"wrap", maxWidth:260 }}>
            {team.map((p) => <Sprite key={p.id} id={p.id} size={44}/>)}
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#F85888", fontSize:"clamp(15px,4.5vw,20px)" }}>VS</div>
          </div>
          {/* their side */}
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
            <Trainer name={leader.name} size={96}
              glow={leader.role==="CHAMPION" ? "#FFCB05" : TYPE_COLORS[leader.type]}/>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:10,
                color: leader.role==="CHAMPION" ? "#FFCB05" : "#9aa6cf", letterSpacing:1 }}>
                {leader.role==="CHAMPION" ? "👑 " : ""}{roleLabel}
              </div>
              <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#fff", fontSize:"clamp(12px,3.6vw,15px)", marginTop:6 }}>
                {leader.name.toUpperCase()}
              </div>
              <div style={{ marginTop:8 }}><TypeBadge t={leader.type}/></div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8, justifyContent:"center" }}>
                <Sprite id={leader.ace} size={66} glow={TYPE_COLORS[leader.type]}/>
                <div style={{ textAlign:"left" }}>
                  <div style={{ color:"#9aa6cf", fontSize:10, fontFamily:"'IBM Plex Mono', monospace" }}>ACE</div>
                  <div style={{ color:"#cfd6f4", fontSize:11, fontFamily:"'Press Start 2P', monospace" }}>{aceP.name.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* boss squad — like the games */}
        <div style={{ marginTop:14 }}>
          <div className="panelTitle" style={{ marginBottom:8 }}>
            {leader.name.toUpperCase()}'S SQUAD ({bteam.length})
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            {bteam.map((m, i) => (
              <div key={m.id} style={{ textAlign:"center", width:74, position:"relative",
                padding:"6px 2px", borderRadius:8,
                background: i === bteam.length-1 ? "rgba(255,203,5,.08)" : "rgba(8,11,24,.5)",
                border: i === bteam.length-1 ? "1px solid #FFCB0566" : "1px solid #1c2440" }}>
                {i === bteam.length-1 && (
                  <div style={{ position:"absolute", top:-7, left:"50%", transform:"translateX(-50%)",
                    fontFamily:"'Press Start 2P', monospace", fontSize:7, color:"#0b0f1e",
                    background:"#FFCB05", padding:"2px 5px", borderRadius:3 }}>ACE</div>
                )}
                <Sprite id={m.id} size={46}/>
                <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#cfd6f4",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2 }}>{m.name}</div>
                <div style={{ display:"flex", gap:2, justifyContent:"center", marginTop:3, flexWrap:"wrap" }}>
                  {m.types.map((t) => (
                    <span key={t} style={{ width:8, height:8, borderRadius:2, background:TYPE_COLORS[t],
                      display:"inline-block" }} title={t}/>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* matchup intel: who's buffed, who's nerfed for THIS fight */}
        <div style={{ marginTop:14 }}>
          <div className="panelTitle" style={{ marginBottom:8 }}>YOUR MATCHUPS — TYPE BUFFS &amp; NERFS</div>
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            {team.map((p) => {
              const m = battleMod(p, bteam);
              const pct = Math.round((m - 1) * 100);
              const adv = pct >= 4 ? 1 : pct <= -4 ? -1 : 0;
              const col = adv > 0 ? "#6CF06C" : adv < 0 ? "#F85888" : "#9aa6cf";
              const battleLv = Math.min(100, Math.max(1, Math.round(p.level * m)));
              return (
                <div key={p.id} style={{ textAlign:"center", width:74, padding:"6px 2px", borderRadius:8,
                  background:"rgba(8,11,24,.5)", border:`1px solid ${col}55` }}>
                  <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:9, color:col }}>
                    {adv > 0 ? "▲" : adv < 0 ? "▼" : "–"} {pct > 0 ? `+${pct}` : pct}%
                  </div>
                  <Sprite id={p.id} size={46}/>
                  <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#cfd6f4",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2 }}>{p.name}</div>
                  <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:10, marginTop:2 }}>
                    <span style={{ color:"#7d87ad" }}>LV.{p.level}→</span><b style={{ color:col }}>{battleLv}</b>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign:"center", fontFamily:"'IBM Plex Mono', monospace", fontSize:10,
            color:"#7d87ad", marginTop:8 }}>
            ▲ type advantage boosts battle stats · ▼ weakness reduces them · capped at ±10%
          </div>
        </div>

        {/* odds bar */}
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'IBM Plex Mono', monospace",
            fontSize:11, color:"#9aa6cf", marginBottom:5 }}>
            <span>YOUR ODDS</span><span>{Math.round(prob*100)}%</span>
          </div>
          <div style={{ height:10, background:"#1c2440", borderRadius:5, overflow:"hidden" }}>
            <div style={{ width:`${prob*100}%`, height:"100%", borderRadius:5,
              background: prob>0.75 ? "linear-gradient(90deg,#6CF06C,#a4f7a4)" : prob>0.45 ? "linear-gradient(90deg,#FFCB05,#ffe17a)" : "linear-gradient(90deg,#F85888,#ff9eb8)",
              transition:"width .6s ease" }}/>
          </div>
        </div>
      </div>

      {/* battle log / actions */}
      <div style={{ maxWidth: 860, margin: "16px auto 30px", padding:"0 8px" }}>
        {phase === "intro" && !fast && (
          <>
            {(repSpins > 0 || repMon) && (
              <div className="panel" style={{ marginTop:12, borderColor:"#5BC8F5" }}>
                <div className="panelTitle" style={{ color:"#5BC8F5" }}>
                  🔄 REPLACEMENT SPIN ({repSpins} BANKED)
                </div>
                {!repMon ? (
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:12, color:"#9aa6cf",
                      marginBottom:12, lineHeight:1.6 }}>
                      Gym reward: spin one random Pokémon and swap it into your squad — or discard it.
                    </div>
                    <Btn onClick={() => {
                      if (repRolling || repSpins <= 0) return;
                      setRepRolling(true);
                      const cands = DEX.filter((p) => p.gen <= (config.pool || 8) && !team.some((t) => t.id === p.id));
                      let i = 0;
                      const iv = setInterval(() => {
                        setRepMon(pick(cands));
                        if (++i >= 14) { clearInterval(iv); setRepMon(pick(cands)); setRepRolling(false); }
                      }, 75);
                    }} color="#5BC8F5">🎰 USE REPLACEMENT SPIN</Btn>
                  </div>
                ) : (
                  <div style={{ textAlign:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, flexWrap:"wrap" }}>
                      <Sprite id={repMon.id} size={72} glow={repRolling ? null : TYPE_COLORS[repMon.types[0]]}/>
                      <div style={{ textAlign:"left", opacity: repRolling ? .5 : 1 }}>
                        <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:11, color:"#fff" }}>{repMon.name.toUpperCase()}</div>
                        <div style={{ display:"flex", gap:4, marginTop:5, alignItems:"center", flexWrap:"wrap" }}>
                          {repMon.types.map((t) => <TypeBadge key={t} t={t} size={8}/>)}
                          <TierBadge bst={repMon.bst} size={8}/>
                          <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#6CF06C" }}>LV.{repMon.level}</span>
                        </div>
                        <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:10, color:"#9aa6cf", marginTop:4 }}>
                          BST {repMon.bst}{(() => { const m = battleMod(repMon, bteam); const pct = Math.round((m-1)*100);
                            return <span style={{ color: pct >= 4 ? "#6CF06C" : pct <= -4 ? "#F85888" : "#9aa6cf" }}> · vs {leader.name}: {pct>0?`+${pct}`:pct}%</span>; })()}
                        </div>
                      </div>
                    </div>
                    {!repRolling && (
                      <>
                        <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:11, color:"#9aa6cf", margin:"12px 0 8px" }}>
                          tap a teammate to replace — or discard
                        </div>
                        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
                          {team.map((p, i) => (
                            <button key={p.id} onClick={() => {
                              setTeam(team.map((m, j) => j === i ? repMon : m));
                              setRepMon(null); setRepSpins((s) => s - 1);
                            }} style={{ background:"rgba(8,11,24,.6)", border:"2px solid #2a3354", borderRadius:8,
                              cursor:"pointer", padding:"6px 4px", width:72 }}
                              onMouseEnter={(e)=>e.currentTarget.style.borderColor="#5BC8F5"}
                              onMouseLeave={(e)=>e.currentTarget.style.borderColor="#2a3354"}>
                              <Sprite id={p.id} size={44}/>
                              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#cfd6f4",
                                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#F85888", marginTop:2 }}>SWAP ⇄</div>
                            </button>
                          ))}
                        </div>
                        <div style={{ marginTop:12 }}>
                          <Btn ghost color="#9aa6cf" onClick={() => { setRepMon(null); setRepSpins((s) => s - 1); }}>
                            ✕ DISCARD SPIN
                          </Btn>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {tokens > 0 && team.some(canEvolve) && (
              <div className="panel" style={{ marginTop:12, borderColor:"#B07CF5" }}>
                <div className="panelTitle" style={{ color:"#B07CF5" }}>🧬 EVOLVE BEFORE THE BATTLE? ({tokens} TOKEN{tokens>1?"S":""})</div>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  {team.map((p, i) => canEvolve(p) && (
                    <div key={p.id} style={{ textAlign:"center" }}>
                      <Sprite id={p.id} size={52}/>
                      <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:"#cfd6f4", marginBottom:4 }}>{p.name}</div>
                      <EvolveControl compact p={p} tokens={tokens}
                        onEvolve={(np) => { setTokens((t) => t - 1);
                          const nt = team.map((m, j) => j === i ? np : m);
                          setCeleb({ oldP: p, newP: np, oldTeam: team, newTeam: nt });
                          setTeam(nt); }}/>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ textAlign:"center", marginTop:14 }}>
              <Btn big onClick={startFight} color={TYPE_COLORS[leader.type]}>⚔ BATTLE!</Btn>
            </div>
          </>
        )}
        {phase === "fight" && (
          <div style={{ textAlign:"right", marginTop:10 }}>
            <button onClick={skipFight} style={{
              fontFamily:"'Press Start 2P', monospace", fontSize:9, padding:"8px 12px",
              background:"transparent", color:"#FFCB05", border:"2px solid #FFCB05",
              borderRadius:5, cursor:"pointer" }}>
              ⏭ SKIP TO RESULT
            </button>
          </div>
        )}
        {(phase === "fight" || phase === "verdict") && (
          <div className="logbox">
            {log.map((l, i) => (
              <div key={i} className="logline" style={{ color: l.c }}>▸ {l.t}</div>
            ))}
            {phase === "verdict" && (
              <div className={outcome ? "verdict win" : "verdict lose"}>
                {outcome ? `★ VICTORY — ${leader.name.toUpperCase()} DEFEATED!` : `✖ DEFEAT — ${leader.name.toUpperCase()} ENDS YOUR RUN`}
              </div>
            )}
          </div>
        )}
        {phase === "verdict" && !fast && (
          <div style={{ textAlign:"center", marginTop:16 }}>
            <Btn big onClick={advance} color={outcome ? "#6CF06C" : "#F85888"}>
              {outcome ? (battleIdx===12 ? "CLAIM VICTORY →" : "NEXT BATTLE →") : "SEE RESULTS →"}
            </Btn>
          </div>
        )}
        {phase === "verdict" && fast && !outcome && (
          <div style={{ textAlign:"center", marginTop:16 }}>
            <Btn big onClick={advance} color="#F85888">SEE RESULTS →</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Results screen ---------------- */
function ResultsScreen({ config, team, results, perfect, onRestart }) {
  const wins = results.filter((r) => r.win).length;
  const losses = results.length - wins;
  const target = config.mode === "world" ? 104 : 13;
  const flawless = perfect && losses === 0;
  const ended = results[results.length - 1];
  const [copied, setCopied] = useState(false);

  const regionLabel = config.mode === "world" ? "WORLD TOUR" : REGIONS[config.region].name.toUpperCase();

  const emoji = results.map((r) =>
    !r.win ? "❌" : r.role === "CHAMPION" ? "👑" : r.role === "ELITE" ? "⭐" : "🏅"
  ).join("");

  const shareText =
`⚡ POKÉ GAUNTLET ⚡
${regionLabel} · ${DIFFS[config.diff].label} MODE
${emoji}
${flawless ? `${wins}-0 — ${config.mode==="world" ? "WORLD CHAMPION!" : "UNDEFEATED CHAMPION!"} 🏆` : `${wins}-${losses} — fell to ${ended.leader} (${ended.role.toLowerCase()})`}
Squad (${teamRating(team).grade}-rank): ${team.map((p) => `${p.name} Lv.${p.level}`).join(" · ")}
Can your squad go ${target}-0?`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText + "\n" + SHARE_URL);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareText + "\n" + SHARE_URL; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ---- share-image generation (canvas, drawn from the embedded spritesheet) ---- */
  const [imgUrl, setImgUrl] = useState(null);
  const blobRef = useRef(null);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try { await document.fonts.ready; } catch {}
      const sheet = new Image();
      sheet.src = POKESHEET;
      let sheetReady = true;
      try { await sheet.decode(); } catch { sheetReady = false; }
      if (cancelled) return;

      const W = 1080, H = 1350;
      const cv = document.createElement("canvas");
      cv.width = W; cv.height = H;
      const ctx = cv.getContext("2d");

      // backdrop
      ctx.fillStyle = "#0b0f1e"; ctx.fillRect(0, 0, W, H);
      let g = ctx.createRadialGradient(W/2, -100, 50, W/2, -100, 900);
      g.addColorStop(0, "rgba(42,110,187,.45)"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      g = ctx.createRadialGradient(W, H, 50, W, H, 800);
      g.addColorStop(0, "rgba(227,53,13,.22)"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // pokeball watermark
      ctx.save(); ctx.globalAlpha = .07; ctx.lineWidth = 26; ctx.strokeStyle = "#fff";
      ctx.beginPath(); ctx.arc(W/2, H/2 + 60, 430, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W/2 - 430, H/2 + 60); ctx.lineTo(W/2 + 430, H/2 + 60); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2, H/2 + 60, 95, 0, Math.PI*2); ctx.stroke();
      ctx.restore();

      const px = (s) => `${s}px 'Press Start 2P', monospace`;
      const mono = (s, w) => `${w || 400} ${s}px 'IBM Plex Mono', monospace`;
      ctx.textAlign = "center";

      // header
      ctx.fillStyle = "#FFCB05";
      ctx.shadowColor = "#2A6EBB"; ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 6;
      ctx.font = px(58);
      ctx.fillText("POKÉ GAUNTLET", W/2, 120);
      ctx.shadowColor = "transparent"; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      ctx.fillStyle = "#9aa6cf"; ctx.font = mono(30, 600);
      ctx.fillText(`${regionLabel} · ${DIFFS[config.diff].label} MODE`, W/2, 180);

      // record
      ctx.fillStyle = flawless ? "#FFCB05" : "#F85888";
      ctx.shadowColor = flawless ? "rgba(255,203,5,.6)" : "rgba(248,88,136,.5)"; ctx.shadowBlur = 40;
      ctx.font = px(150);
      ctx.fillText(`${wins}-${losses}`, W/2, 380);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff"; ctx.font = px(26);
      ctx.fillText(flawless ? (config.mode === "world" ? "WORLD CHAMPION!" : "UNDEFEATED CHAMPION!") : `FELL TO ${ended.leader.toUpperCase()}`, W/2, 450);

      // badge dots
      const dotR = 16, gap = 42;
      const rowW = Math.min(results.length, 20) * gap;
      results.slice(0, 40).forEach((r, i) => {
        const rowI = Math.floor(i / 20);
        const colI = i % 20;
        const inRow = Math.min(results.length - rowI * 20, 20);
        const x = W/2 - (inRow * gap)/2 + colI * gap + gap/2;
        const y = 520 + rowI * 48;
        ctx.beginPath(); ctx.arc(x, y, dotR, 0, Math.PI*2);
        ctx.fillStyle = !r.win ? "#F85888" : r.role === "CHAMPION" ? "#FFCB05" : r.role === "ELITE" ? "#B07CF5" : "#6CF06C";
        ctx.fill();
      });

      // squad grid 3x2 from the spritesheet
      ctx.imageSmoothingEnabled = false;
      const cell = 200, sx0 = W/2 - cell*1.5, sy0 = 660;
      team.forEach((p, i) => {
        const col = (p.id - 1) % SHEET_COLS, row = Math.floor((p.id - 1) / SHEET_COLS);
        const dx = sx0 + (i % 3) * cell, dy = sy0 + Math.floor(i / 3) * (cell + 56);
        ctx.fillStyle = "rgba(17,23,46,.85)";
        ctx.strokeStyle = TYPE_COLORS[p.types[0]]; ctx.lineWidth = 4;
        roundRect(ctx, dx + 12, dy, cell - 24, cell + 36, 18); ctx.fill(); ctx.stroke();
        if (sheetReady) {
          ctx.drawImage(sheet, col*SHEET_CELL, row*SHEET_CELL, SHEET_CELL, SHEET_CELL, dx + 28, dy + 8, cell - 56, cell - 56);
        } else {
          const cx2 = dx + cell/2, cy2 = dy + (cell-40)/2 + 20, r2 = (cell-90)/2;
          ctx.beginPath(); ctx.arc(cx2, cy2, r2, Math.PI, 0); ctx.fillStyle = "#E3350D"; ctx.fill();
          ctx.beginPath(); ctx.arc(cx2, cy2, r2, 0, Math.PI); ctx.fillStyle = "#fff"; ctx.fill();
          ctx.beginPath(); ctx.arc(cx2, cy2, r2*.3, 0, Math.PI*2); ctx.fillStyle = "#fff"; ctx.fill();
          ctx.lineWidth = 5; ctx.strokeStyle = "#0b0f1e";
          ctx.beginPath(); ctx.arc(cx2, cy2, r2, 0, Math.PI*2); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx2, cy2, r2*.3, 0, Math.PI*2); ctx.stroke();
        }
        ctx.fillStyle = "#cfd6f4"; ctx.font = px(13);
        ctx.fillText(p.name.length > 11 ? p.name.slice(0, 10) + "…" : p.name, dx + cell/2, dy + cell - 28);
        ctx.fillStyle = "#6CF06C"; ctx.font = mono(22, 600);
        ctx.fillText(`LV.${p.level}`, dx + cell/2, dy + cell + 6);
      });

      // footer
      ctx.fillStyle = "#FFCB05"; ctx.font = px(22);
      ctx.fillText(`CAN YOUR SQUAD GO ${target}-0?`, W/2, H - 110);
      ctx.fillStyle = "#5BC8F5"; ctx.font = mono(28, 600);
      ctx.fillText(SHARE_URL.replace(/^https?:\/\//, ""), W/2, H - 60);

      cv.toBlob((blob) => {
        if (cancelled || !blob) return;
        blobRef.current = blob;
        setImgUrl(URL.createObjectURL(blob));
      }, "image/png");
    })();
    return () => { cancelled = true; };
  }, []);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const shareImage = async () => {
    const blob = blobRef.current;
    if (!blob) { copy(); return; }
    const file = new File([blob], "poke-gauntlet-result.png", { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Poké Gauntlet", text: shareText + "\n" + SHARE_URL });
        setShared(true); setTimeout(() => setShared(false), 2000);
        return;
      }
      throw new Error("no file share");
    } catch (err) {
      if (err && err.name === "AbortError") return; // user closed share sheet
      // fallback: download the image + copy text & link
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "poke-gauntlet-result.png";
      document.body.appendChild(a); a.click(); a.remove();
      copy();
    }
  };

  return (
    <div className="screen" style={{ textAlign:"center" }}>
      <div className="poof" style={{ marginTop:34 }}>
        <div style={{ fontSize: 56 }}>{flawless ? "🏆" : "💔"}</div>
        <div style={{ fontFamily:"'Press Start 2P', monospace",
          color: flawless ? "#FFCB05" : "#F85888",
          textShadow: flawless ? "0 0 30px rgba(255,203,5,.5)" : "none",
          fontSize:"clamp(30px,6vw,52px)", marginTop:10 }}>
          {wins}-{losses}
        </div>
        <div style={{ fontFamily:"'Press Start 2P', monospace", color:"#fff", fontSize:13, marginTop:12 }}>
          {flawless
            ? (config.mode === "world" ? "WORLD CHAMPION — ALL 8 REGIONS!" : "HALL OF FAME — UNDEFEATED!")
            : `${ended.leader.toUpperCase()} (${ended.role}) ENDED THE RUN`}
        </div>
        {!flawless && (
          <div style={{ display:"flex", justifyContent:"center", marginTop:10 }}>
            <Trainer name={ended.leader} size={84} glow="#F85888"/>
          </div>
        )}
        <div style={{ color:"#9aa6cf", fontFamily:"'IBM Plex Mono', monospace", fontSize:12, marginTop:8 }}>
          {regionLabel} · {DIFFS[config.diff].label} MODE
        </div>
      </div>

      {/* share card */}
      <div className="panel poof d1" style={{ maxWidth: 620, margin:"24px auto 0",
        borderColor: flawless ? "#FFCB05" : "#F85888" }}>
        <div className="panelTitle">YOUR SQUAD</div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
          {team.map((p) => (
            <div key={p.id} style={{ width:86 }}>
              <Sprite id={p.id} size={70} glow={TYPE_COLORS[p.types[0]]}/>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:9, color:"#cfd6f4",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:9, color:TIER_COLORS[tierOf(p.bst)] }}>LV.{p.level}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:20, letterSpacing:3, marginTop:16, wordBreak:"break-all", lineHeight:1.6 }}>{emoji}</div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", justifyContent:"center", marginTop:14 }}>
          {results.map((r, i) => (
            <div key={i} title={`${r.leader} (${r.region})`} style={{
              fontFamily:"'IBM Plex Mono', monospace", fontSize:10,
              padding:"4px 7px", borderRadius:4,
              background: r.win ? "rgba(108,240,108,.1)" : "rgba(248,88,136,.18)",
              color: r.win ? "#6CF06C" : "#F85888",
              border:`1px solid ${r.win ? "#6CF06C44" : "#F8588866"}`,
            }}>{r.leader}</div>
          ))}
        </div>
      </div>

      {imgUrl && (
        <div className="poof d2" style={{ marginTop:22 }}>
          <div className="panelTitle">YOUR SHARE CARD</div>
          <img src={imgUrl} alt="Result card" style={{ width:"min(300px, 78vw)", borderRadius:14,
            border:"3px solid #2a3354", boxShadow:"0 14px 50px rgba(0,0,0,.55)" }}/>
        </div>
      )}

      <div className="poof d3" style={{ display:"flex", gap:12, justifyContent:"center", margin:"24px 0 44px", flexWrap:"wrap" }}>
        <Btn big onClick={shareImage} disabled={!imgUrl} color="#6CF06C">
          {shared ? "✔ SHARED!" : "📤 SHARE IMAGE"}
        </Btn>
        <Btn onClick={copy} color="#5BC8F5">{copied ? "✔ COPIED!" : "📋 COPY TEXT"}</Btn>
        <Btn onClick={onRestart}>↺ NEW RUN</Btn>
      </div>
    </div>
  );
}

/* ---------------- App shell ---------------- */
export default function App() {
  const [screen, setScreen] = useState("title");
  const [config, setConfig] = useState(null);
  const [team, setTeam] = useState([]);
  const [results, setResults] = useState([]);
  const [perfect, setPerfect] = useState(false);
  const [tokens, setTokens] = useState(0);

  return (
    <div style={{ minHeight:"100vh", background:"#0b0f1e", position:"relative", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; }
        body { background:#0b0f1e; }
        .screen { position: relative; z-index: 2; padding: 0 14px; }
        .bgfx { position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(42,110,187,.28), transparent),
            radial-gradient(ellipse 45% 35% at 85% 100%, rgba(227,53,13,.12), transparent),
            radial-gradient(ellipse 40% 30% at 10% 95%, rgba(255,203,5,.07), transparent);
        }
        .scan { position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity:.5;
          background: repeating-linear-gradient(0deg, rgba(255,255,255,.022) 0 1px, transparent 1px 3px); }
        .panel { background: rgba(17,23,46,.82); border: 2px solid #2a3354; border-radius: 12px;
          padding: 18px; backdrop-filter: blur(4px); }
        .panelTitle { font-family:'Press Start 2P', monospace; font-size: 10px; color:#7d87ad;
          letter-spacing: 2px; margin-bottom: 14px; text-align: center; }
        .chip { padding: 12px 14px; border-radius: 8px; border: 2px solid; cursor: pointer;
          min-width: 150px; max-width: 190px; transition: all .15s; }
        .stage { width: min(440px, 92vw); height: 300px; border: 3px solid; border-radius: 16px;
          display:flex; align-items:center; justify-content:center;
          background: radial-gradient(ellipse 60% 50% at 50% 60%, rgba(42,110,187,.14), rgba(11,15,30,.6));
          transition: border-color .3s, box-shadow .3s; }
        .slot { width: 96px; height: 96px; border: 2px dashed; border-radius: 10px;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          background: rgba(17,23,46,.6); }
        .logbox { background: rgba(8,11,24,.92); border: 2px solid #2a3354; border-radius: 10px;
          padding: 16px 18px; margin-top: 16px; min-height: 120px;
          font-family:'IBM Plex Mono', monospace; font-size: 13px; text-align:left; }
        .logline { padding: 4px 0; animation: slideIn .3s ease both; line-height: 1.5; }
        .verdict { font-family:'Press Start 2P', monospace; font-size: 14px; margin-top: 14px;
          padding: 12px; border-radius: 8px; text-align: center; animation: stamp .4s cubic-bezier(.2,2,.4,1) both; }
        .verdict.win { color:#0b0f1e; background:#6CF06C; box-shadow: 0 0 30px rgba(108,240,108,.4); }
        .verdict.lose { color:#fff; background:#c81e4e; box-shadow: 0 0 30px rgba(248,88,136,.4); }
        .settle { animation: settle .35s cubic-bezier(.2,1.8,.4,1) both; }
        .poof { animation: rise .6s ease both; }
        .d1 { animation-delay: .12s; } .d2 { animation-delay: .24s; } .d3 { animation-delay: .36s; }
        @keyframes rise { from { opacity:0; transform: translateY(18px);} to { opacity:1; transform:none;} }
        @keyframes slideIn { from { opacity:0; transform: translateX(-10px);} to { opacity:1; transform:none;} }
        @keyframes stamp { from { opacity:0; transform: scale(1.6);} to { opacity:1; transform: scale(1);} }
        @keyframes settle { from { transform: scale(.85);} to { transform: scale(1);} }
        .reelWindow { width: 150px; height: 42px; border: 2px solid; border-radius: 8px;
          display:flex; align-items:center; justify-content:center; background: rgba(8,11,24,.9);
          transition: border-color .25s; overflow:hidden; }
        .reelSpin { animation: reelGlow .25s linear infinite; }
        .reelArrow { width: 32px; height: 42px; border-radius: 6px; border: 2px solid #2a3354;
          background: rgba(17,23,46,.8); color: #9aa6cf; cursor: pointer; font-size: 12px; }
        .reelArrow:hover:not(:disabled) { border-color: #FFCB05; color: #FFCB05; }
        .reelArrow:disabled { cursor: not-allowed; opacity: .5; }
        @keyframes reelGlow { 0%,100% { box-shadow: 0 0 6px rgba(255,203,5,.3);} 50% { box-shadow: 0 0 18px rgba(255,203,5,.7);} }
        .flashfx { position: absolute; inset: 0; background: #fff; z-index: 3; pointer-events:none;
          animation: flash .55s ease-out forwards; }
        @keyframes flash { 0% { opacity: .9; } 100% { opacity: 0; } }
        .stageShake { animation: shake .45s cubic-bezier(.36,.07,.19,.97); }
        @keyframes shake { 10%,90% { transform: translateX(-2px);} 20%,80% { transform: translateX(3px);}
          30%,50%,70% { transform: translateX(-5px);} 40%,60% { transform: translateX(5px);} }
        .rays { position:absolute; inset:-40%; pointer-events:none; z-index:1; opacity:.5;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(255,203,5,.28) 12deg, transparent 24deg,
            transparent 60deg, rgba(255,203,5,.28) 72deg, transparent 84deg, transparent 120deg,
            rgba(255,203,5,.28) 132deg, transparent 144deg, transparent 180deg, rgba(255,203,5,.28) 192deg,
            transparent 204deg, transparent 240deg, rgba(255,203,5,.28) 252deg, transparent 264deg,
            transparent 300deg, rgba(255,203,5,.28) 312deg, transparent 324deg, transparent 360deg);
          animation: spinRays 9s linear infinite; }
        @keyframes spinRays { to { transform: rotate(360deg); } }
        .spark { position:absolute; top:18%; color:#FFCB05; font-size:16px; z-index:2; pointer-events:none;
          animation: sparkFloat 1.8s ease-in-out infinite; text-shadow: 0 0 8px #FFCB05; }
        @keyframes sparkFloat { 0%,100% { transform: translateY(0) scale(.7); opacity:.3; }
          50% { transform: translateY(-14px) scale(1.15); opacity:1; } }
        .popin { display:inline-block; animation: popIn .4s cubic-bezier(.2,1.8,.4,1) both; }
        @keyframes popIn { from { opacity:0; transform: scale(.3);} to { opacity:1; transform: scale(1);} }
        .hoverWiggle:hover { animation: wiggle .5s ease-in-out; }
        @keyframes wiggle { 0%,100% { transform: rotate(0);} 25% { transform: rotate(-5deg);} 75% { transform: rotate(5deg);} }
        .spriteBounce { animation: bigBounce .5s cubic-bezier(.3,1.6,.4,1); }
        @keyframes bigBounce { 0% { transform: translateY(0) scale(1);} 40% { transform: translateY(-22px) scale(1.08);} 100% { transform: translateY(0) scale(1);} }
        button:focus-visible { outline: 2px solid #FFCB05; outline-offset: 2px; }
        button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        .qtyBtn { width: 54px; height: 54px; border-radius: 12px; border: 2px solid #B07CF5;
          background: rgba(176,124,245,.12); color: #B07CF5; font-size: 26px; cursor: pointer;
          font-family: 'IBM Plex Mono', monospace; }
        .qtyBtn:disabled { opacity: .35; cursor: not-allowed; }
        .hud { position: fixed; bottom: 0; left: 0; right: 0; z-index: 60;
          display: flex; justify-content: space-around; align-items: center; gap: 6px;
          padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px));
          background: rgba(10,14,28,.92); backdrop-filter: blur(10px);
          border-top: 2px solid #2a3354; box-shadow: 0 -8px 30px rgba(0,0,0,.45); }
        .hasHud { padding-bottom: 96px !important; }

        /* ---------- mobile-first refinements ---------- */
        @media (max-width: 560px) {
          /* declutter: HUD already shows spins/tokens/pick/pool — hide duplicates */
          .metaRow { display: none !important; }
          .reelHint { display: none !important; }
          .reelsRow { gap: 12px !important; margin-top: 12px !important; }
          .spinHint { font-size: 12px !important; padding: 0 6px; line-height: 1.6; }
          /* solid nav bar on mobile — no glass */
          .hud { background: #0a0e1c !important; backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important; }
          .helpBtn { width: 44px !important; height: 44px !important; }
          .primaryAction { flex: 1 1 100% !important; order: 5; }
          .gbtn { flex: 1 1 auto; max-width: 100%; }
          .screen { padding: 0 10px; }
          .panel { padding: 13px 11px; border-radius: 10px; }
          .panelTitle { font-size: 8px; letter-spacing: 1px; margin-bottom: 10px; }
          .chip { min-width: 100%; max-width: 100%; padding: 13px 12px; }
          .stage { width: 100%; height: 290px; }
          .slot { width: 30%; min-width: 96px; }
          .logbox { font-size: 12px; padding: 12px 12px; }
          .verdict { font-size: 11px; line-height: 1.7; }
          .reelWindow { width: min(140px, 36vw); }
          .reelArrow { width: 36px; height: 44px; }
        }
        @media (max-width: 380px) {
          .reelWindow { width: 32vw; }
          .reelWindow > div { font-size: 8px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
      <div className="bgfx"/>
      <div className="scan"/>

      {screen === "title" && (
        <TitleScreen onStart={(cfg) => { setConfig(cfg); setTokens(DIFFS[cfg.diff].tokens); setScreen("draft"); }}/>
      )}
      {screen === "draft" && (
        <DraftScreen config={config} tokens={tokens} setTokens={setTokens}
          onDone={(t) => { setTeam(t); setScreen("report"); }}/>
      )}
      {screen === "report" && (
        <TeamReportScreen config={config} team={team} setTeam={setTeam}
          tokens={tokens} setTokens={setTokens} onEnter={() => setScreen("gauntlet")}/>
      )}
      {screen === "gauntlet" && (
        <GauntletScreen config={config} team={team} setTeam={setTeam}
          tokens={tokens} setTokens={setTokens}
          onFinish={(res, perf) => { setResults(res); setPerfect(perf); setScreen("results"); }}/>
      )}
      {screen === "results" && (
        <ResultsScreen config={config} team={team} results={results} perfect={perfect}
          onRestart={() => { setScreen("title"); setTeam([]); setResults([]); }}/>
      )}

      <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"14px 16px 30px",
        color:"#5f6a96", fontSize:11, fontFamily:"'IBM Plex Mono', monospace", lineHeight:1.8 }}>
        <div>
          POKÉ GAUNTLET is a free, <b>non-commercial</b> fan-made game by{" "}
          <a href="https://arommedis.com" target="_blank" rel="noopener noreferrer"
            style={{ color:"#7d87ad", textDecoration:"underline" }}>Arom Medis</a>.
          It is not monetized in any way — no ads, no purchases, no revenue.
        </div>
        <div>
          Not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, or The Pokémon Company.
          Pokémon and all related names and images are trademarks of their respective owners.
        </div>
        <div>Pokémon data &amp; sprites via PokéAPI · trainer sprites via Smogon.</div>
      </div>
    </div>
  );
}
