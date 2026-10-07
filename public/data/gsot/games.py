import json
import re
from collections import OrderedDict
from datetime import datetime
from pprint import pprint

from bs4 import BeautifulSoup


def parse_date(date_str):
    formats = [
        ("%Y/%m/%d", {}),
        ("%Y/%m", {"month": 1, "day": 1}),
        ("%Y", {"month": 1, "day": 1})
    ]
    
    for fmt, defaults in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.replace(**defaults).strftime('%d/%m/%Y')
        except ValueError:
            continue
            
    return "Unknown"

def parse_id_word(word):
    if word == 'wii':
        return 'wii'
    if word == 'ds':
        return 'ds'
    if word == '3ds':
        return '3ds'
    if word == 'warioware':
        return 'ww'
    return word[0]

def prep_tags(name):
    tags = []
    if "kart" in name:
        tags.append("kart")
    if "party" in name:
        tags.append("party")
    if "rpg" in name:
        tags.append("rpg")
    if "paper" in name:
        tags.append("paper")
        tags.append("rpg")
    if "mario & luigi" in name:
        tags.append("m&l")
        tags.append("rpg")
    if "dr" in name:
        tags.append("doctor")
        tags.append("puzzle")
    if "tennis" in name:
        tags.append("tennis")
        tags.append("sport")
    if "golf" in name:
        tags.append("golf")
        tags.append("sport")
    if "strikers" in name:
        tags.append("strikers")
        tags.append("sport")
    if "mario" in name and "kong" in name:
        tags.append("puzzle")
    if "mario" in name:
        tags.append("mario")
    if "wario" in name:
        tags.append("wario")
    if "luigi" in name:
        tags.append("luigi")
    if "kong" in name:
        tags.append("dk")
    if "yoshi" in name:
        tags.append("yoshi")
    if "peach" in name:
        tags.append("peach")

    return tags

games = []
url_base = "https://www.mariowiki.com"
all_consoles = {
    "Atari 2600": "atari2600",
    "ColecoVision": "coleco_vision",
    "Intellivision": "itelli_vision",
    "Nintendo Entertainment System": "nes",
    "Family Computer Disk System": "fcds",
    "Family Computer Network System": "csns",
    "Atari 5200": "atari5200",
    "Atari 7800": "atari7800",
    "Super Nintendo Entertainment System": "snes",
    "Satellaview": "satella",
    "Terebikko": "terebikko",
    "Philips CD-i": "cdi",
    "Nintendo 64": "n64",
    "64DD": "64dd",
    "Nintendo GameCube": "ngc",
    "DVD": "dvd",
    "iQue Player": "ique",
    "Wii": "wii",
    "WiiWare": "wii_ware",
    "Wii U": "wiiu",
    "Nintendo eShop § Wii U": "wiiu_eshop",
    "Classics": "classics",
    "Game & Watch": "gw",
    "Game Boy": "gb",
    "Nelsonic Game Watch": "ngw",
    "Super Mario Bros. Watch": "smb_watch",
    "Barcode Battler II": "bb2",
    "Gamewatch Boy": "gwb",
    "Virtual Boy": "vb",
    "Game Boy Color": "gbc",
    "Mini Classics": "mini_classics",
    "Sewing machines": "sm",
    "Game Boy Advance": "gba",
    "e-Reader": "e_reader",
    "Nintendo DS": "ds",
    "DSiWare": "dsi",
    "Nintendo 3DS": "3ds",
    "Nintendo eShop § Nintendo 3DS": "3ds_eshop",
    "Nvidia Shield TV": "shield",
    "Nintendo Switch": "switch",
    "Nintendo eShop § Nintendo Switch": "switch_eshop",
    "Nintendo Switch 2": "switch2",
    "Nintendo eShop § Nintendo Switch 2": "switch2_eshop",
    "VS. System": "vs_system",
    "Nintendo PlayChoice-10": "playchoice",
    "Nintendo Super System": "nss",
    "Triforce": "triforce",
    "Texas Instruments TI-99/4A": "texas_instruments",
    "MS-DOS": "msdos",
    "VIC-20": "vic20",
    "Apple II": "apple2",
    "Atari 800XL": "atari800xl",
    "Commodore 64": "commodore64",
    "PC-8001": "pc8001",
    "Coleco Adam": "coleco_adam",
    "PC-9801": "pc9801",
    "PC-8801": "pc8801",
    "PC-6001mkII": "pc6001",
    "PC-6601": "pc6601",
    "SMC-777": "smc777",
    "X1": "x1",
    "MZ-1500": "mz1500",
    "MZ-2200": "mz2200",
    "FM-7": "fm7",
    "PC-8001mkIISR": "pc8001",
    "Atari 130XE": "atari120xe",
    "MSX": "msx",
    "Amstrad CPC": "amstrad",
    "ZX Spectrum": "zxs",
    "Atari XEGS": "atarixegs",
    "IBM JX": "ibmjx",
    "Macintosh": "macintosh",
    "Mac OS": "macos",
    "Game Processor": "game_processor",
    "Windows": "windows",
    "HTML": "html",
    "Play Nintendo activities": "play_nintendo",
    "Adobe Shockwave": "adobe_shockwave",
    "Adobe Flash": "adobe_flash",
    "Java": "java",
    "PBEM": "pbem",
    "iPadOS": "mobile",
    "Android": "mobile",
    "Roku TV": "roku",
    "Sky Italia": "sky_italia",
    "Traditional": "arcade",
    "Coleco tabletop arcade game": "coleco_tabletop",
    "Hitachi S1": "hitachi_s1",
    "Hitachi B16": "hitachi_b16",
    "Samsung SPC-1500": "samsung_spc1500"
}

blacklist = {
    "Adobe Shockwave", "Adobe Flash", "HTML"
}

with open("all-games.html", "r", encoding = 'utf-8') as file:
    text = file.read()
    soup = BeautifulSoup(text, "html.parser")

tables = soup.find_all("table")

for table in tables:
    title = table.find_previous()
    try:

        console = title.get_text()
        if console == "Android" or console == "iPadOS":
            console = "Mobile"
            console_link = ""
        else:
            console_link = title["href"]
            console_link = url_base + console_link if "https" not in console_link else console_link
        
    except Exception:  # noqa: BLE001
        console_link = ""
        console = title.get_text()

    if console not in all_consoles or console in blacklist:
        continue

    try:
        column_heads = table.find("thead").find("tr").find_all("th")
        columns = [head.get_text() for head in column_heads]
        columns.pop(0)
    except Exception:  # noqa: BLE001, S112
        continue

    rows = table.find("tbody").find_all("tr")
    for row in rows:
        cells = row.find_all("td")
        num_cells = len(cells)
        try:
            name = cells[0].find_all("a", href=True)[0]

            id = ''.join([parse_id_word(w) for w in re.sub(r'[^a-zA-Z0-9 ]', '', name.get_text().replace('-', ' ')).lower().split(" ") if w != '']) + "-" + all_consoles[console]

            print(f"'{name.get_text()}': {id}")

            releases = []
            for i in range(1, num_cells-1):
                date = cells[i].get_text().strip('\n').replace(" ", "")
                if "N/A" in date:
                    date = "Unknown"
                else:
                    date = parse_date(date)

            
                release = {
                    "region": columns[i].split("release")[0].strip(),
                    "date": date
                }
                releases.append(release)

            devs = cells[num_cells-1].find_all("a", href=True)
            if len(devs) > 0 :
                devs = [{
                    "link": url_base + dev["href"] if "https" not in dev["href"] else dev["href"],
                    "name": dev.get_text()
                } for dev in devs]
            else:
                devs = [{"link": "", "name": "Unknown"}]

            game = OrderedDict()
            game["id"] = id
            game["name"] = name.get_text()
            game["link"] = url_base + name["href"]
            game["console"] = {"link": console_link, "name": console}
            game["releases"] = releases 
            game["developers"] = devs 
            game["tags"] = prep_tags(name.get_text().lower())

            games.append(game)
        except Exception as exc:
            print(f"Failed to extract {exc}")

ids = {}
for game in games:
    id = game["id"]
    if id not in ids:
        ids[id] = [game]
    else:
        ids[id].append(game)

for id in ids:
    if len(ids[id]) > 1:
        print(f"id '{id}' appears multiple times")
        print("----------------------------")
        for game in ids[id]:
            pprint(game)
            print()

# with open("games-new.json5", 'w') as f:
#     json.dump(games, f, indent=4)

print("complete")