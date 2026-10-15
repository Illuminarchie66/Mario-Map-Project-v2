import re
import json

"""
Character object:
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },

Allegiances:


Species:

Tags:
- onlyPlayableInMKWorld
- hasMultipleColors

"""

"""
Characters to do:
Mario
Luigi
Peach
Bowser
P
"""

characters = [
    {
        "name": "Mario",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Mario",
        "imageLink": "https://mario.wiki.gallery/images/thumb/0/0d/MarioAlternateJamboreeRender.png/1280px-MarioAlternateJamboreeRender.png",
        "firstAppearance": "dk-arcade",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Red",
            "Blue"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Luigi",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Luigi",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/76/SMPJ_Luigi.png/270px-SMPJ_Luigi.png",
        "firstAppearance": "mb-gw",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Green",
            "Blue"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Princess Peach",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Princess_Peach",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/7c/Peach_Posing_Alt_3D_Artwork.png/270px-Peach_Posing_Alt_3D_Artwork.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Pink",
            "Blue"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Yoshi",
        "species": ["Dinosaur"],
        "description": "",
        "link": "https://www.mariowiki.com/Yoshi",
        "imageLink": "https://mario.wiki.gallery/images/thumb/5/5f/SMPJ_Yoshi.png/300px-SMPJ_Yoshi.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "yatmb-switch2",
        "colors": [
            "Green",
            "Red"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": ["multi-colored"]
    },
    {
        "name": "Toad",
        "species": ["Toad"],
        "description": "",
        "link": "https://www.mariowiki.com/Toad",
        "imageLink": "https://mario.wiki.gallery/images/thumb/5/53/SMG1%2BSMG2_Toad.png/300px-SMG1%2BSMG2_Toad.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "mtf-switch2"
        "",
        "colors": [
            "White",
            "Red"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": ["multi-colored"]
    },
    {
        "name": "Koopa Troopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Koopa_Troopa",
        "imageLink": "https://mario.wiki.gallery/images/thumb/5/5c/SuperMarioParty_KoopaTroopa.png/300px-SuperMarioParty_KoopaTroopa.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Green",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": ["multi-colored"]
    },
    {
        "name": "Bowser",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Bowser",
        "imageLink": "https://mario.wiki.gallery/images/thumb/c/c7/SMBW_Artwork_Bowser.png/450px-SMBW_Artwork_Bowser.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "yatmb-switch2",
        "colors": [
            "Green",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Wario",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Wario",
        "imageLink": "https://mario.wiki.gallery/images/thumb/2/29/SMPWario.png/375px-SMPWario.png",
        "firstAppearance": "sml26gc-gb",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Yellow",
            "Purple"
        ],
        "allegiances": ["Diamond City"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Waluigi",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Waluigi",
        "imageLink": "https://mario.wiki.gallery/images/thumb/2/27/SuperMarioParty_Waluigi.png/345px-SuperMarioParty_Waluigi.png",
        "firstAppearance": "mt-n64",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Purple",
            "Black"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Pauline",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Pauline",
        "imageLink": "https://mario.wiki.gallery/images/thumb/e/ea/MK8D_BCP_Pauline_artwork.png/180px-MK8D_BCP_Pauline_artwork.png",
        "firstAppearance": "dk-arcade",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Red"
        ],
        "allegiances": ["Metro Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Baby Mario",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Baby_Mario",
        "imageLink": "https://mario.wiki.gallery/images/thumb/5/58/BabyMarioSluggers.png/300px-BabyMarioSluggers.png",
        "firstAppearance": "smw2yi-snes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Red",
            "Blue"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Baby Luigi",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Baby_Luigi",
        "imageLink": "https://mario.wiki.gallery/images/thumb/d/d7/Baby_Luigi_MSS_artwork.png/323px-Baby_Luigi_MSS_artwork.png",
        "firstAppearance": "smw2yi-snes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Green",
            "Blue"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Baby Peach",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Baby_Peach",
        "imageLink": "https://mario.wiki.gallery/images/thumb/2/20/Babypeachsimple.png/300px-Babypeachsimple.png",
        "firstAppearance": "mlpit-ds",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Pink",
            "Blue"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Baby Daisy",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Baby_Daisy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/6/65/Babydaisysimple.png/300px-Babydaisysimple.png",
        "firstAppearance": "mkwii-wii",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Orange",
            "Green"
        ],
        "allegiances": ["Sarasaland"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Toadette",
        "species": ["Toad"],
        "description": "",
        "link": "https://www.mariowiki.com/Toadette",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/7d/SMBW_Toadette.png/338px-SMBW_Toadette.png",
        "firstAppearance": "mkdd-gc",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Pink",
            "White"
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Baby Rosalina",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Baby_Rosalina",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/33/MKT_Artwork_BabyRosalina.png/225px-MKT_Artwork_BabyRosalina.png",
        "firstAppearance": "mk8-wiiu",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Turquoise",
            "Silver"
        ],
        "allegiances": ["Comet Observatory"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Shy Guy",
        "species": ["Shy Guy"],
        "description": "",
        "link": "https://www.mariowiki.com/Shy_Guy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/b/b2/MPS_Shy_Guy_Artwork.png/334px-MPS_Shy_Guy_Artwork.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "yatmb-switch2",
        "colors": [
            "Red",
            "White"
        ],
        "allegiances": ["8 Bits", "Koopatroop"],
        "playable": True,
        "tags": ["multi-colored"]
    },
    {
        "name": "Nabbit",
        "species": ["Rabbit"],
        "description": "",
        "link": "https://www.mariowiki.com/Nabbit",
        "imageLink": "https://mario.wiki.gallery/images/thumb/9/94/SMBW_Nabbit.png/405px-SMBW_Nabbit.png",
        "firstAppearance": "nsmbu-wiiu",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Purple",
            "White"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Piranha Plant",
        "species": ["Plant"],
        "description": "",
        "link": "https://www.mariowiki.com/Piranha_Plant",
        "imageLink": "https://mario.wiki.gallery/images/thumb/e/e8/NSMBU_Piranha_Plant_Cropped.png/255px-NSMBU_Piranha_Plant_Cropped.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "yatmb-switch2",
        "colors": [
            "Red",
            "White",
            "Green"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Hammer Bro",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Hammer_Bro",
        "imageLink": "https://mario.wiki.gallery/images/thumb/e/e3/NSMBU_Hammer_Bro_Artwork.png/450px-NSMBU_Hammer_Bro_Artwork.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Green",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Monty Mole",
        "species": ["Mole"],
        "description": "",
        "link": "https://www.mariowiki.com/Monty_Mole",
        "imageLink": "https://mario.wiki.gallery/images/thumb/5/56/Monty_Mole_SMP.png/375px-Monty_Mole_SMP.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Brown",
            "White"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Goomba",
        "species": ["Goomba"],
        "description": "",
        "link": "https://www.mariowiki.com/Goomba",
        "imageLink": "https://mario.wiki.gallery/images/7/7d/SMBW_Goomba.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Brown"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Sidestepper",
        "species": ["Crab"],
        "description": "",
        "link": "https://www.mariowiki.com/Sidestepper",
        "imageLink": "https://mario.wiki.gallery/images/thumb/1/1b/MK8_Asset_Model_Sidestepper.png/375px-MK8_Asset_Model_Sidestepper.png",
        "firstAppearance": "mb-arcade",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Red",
            "Yellow"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Cheep Cheep",
        "species": ["Fish"],
        "description": "",
        "link": "https://www.mariowiki.com/Cheep_Cheep",
        "imageLink": "https://mario.wiki.gallery/images/thumb/6/63/CheepCheepNSMBU.png/375px-CheepCheepNSMBU.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Red",
            "White"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Dry Bones",
        "species": ["Undead", "Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Dry_Bones",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/33/MPSR_Dry_Bones.png/345px-MPSR_Dry_Bones.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Grey",
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Wiggler",
        "species": ["Caterpillar"],
        "description": "",
        "link": "https://www.mariowiki.com/Wiggler",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/7c/WigglerDS.png/375px-WigglerDS.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Yellow",
            "Orange"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Pokey",
        "species": ["Cactus"],
        "description": "",
        "link": "https://www.mariowiki.com/Pokey",
        "imageLink": "https://mario.wiki.gallery/images/thumb/e/e6/NSMBU_Pokey_Artwork.png/150px-NSMBU_Pokey_Artwork.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Yellow",
            "Green"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Moo Moo",
        "species": ["Cow"],
        "description": "",
        "link": "https://www.mariowiki.com/Cow",
        "imageLink": "https://mario.wiki.gallery/images/thumb/5/52/MK8_Asset_Model_Moo_Moo_%28White%29.png/375px-MK8_Asset_Model_Moo_Moo_%28White%29.png",
        "firstAppearance": "mk64-n64",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "White",
            "Black"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Stingby",
        "species": ["Bee"],
        "description": "",
        "link": "https://www.mariowiki.com/Stingby",
        "imageLink": "https://mario.wiki.gallery/images/thumb/e/e1/SMM2_Stingby_Solo.png/300px-SMM2_Stingby_Solo.png",
        "firstAppearance": "sm3dl-3ds",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Yellow",
            "Brown"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Snowman",
        "species": ["Snowpeople"],
        "description": "",
        "link": "https://www.mariowiki.com/Snowman",
        "imageLink": "https://mario.wiki.gallery/images/thumb/c/c6/Mario_Kart_World_Snowman.png/180px-Mario_Kart_World_Snowman.png",
        "firstAppearance": "mk64-n64",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "White",
            "Blue"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Penguin",
        "species": ["Penguin"],
        "description": "",
        "link": "https://www.mariowiki.com/Penguin",
        "imageLink": "https://mario.wiki.gallery/images/1/13/DMW-Penguin.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Blue",
            "White"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Para-Biddybud",
        "species": ["Biddybud"],
        "description": "",
        "link": "https://www.mariowiki.com/Para-Biddybud",
        "imageLink": "https://mario.wiki.gallery/images/1/19/SM3DW_BF_Para-BiddybudStamp.png",
        "firstAppearance": "sm3dl-3ds",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Red",
            "White"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Princess Daisy",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Daisy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/b/b5/Daisy_Render_MP6_2.png/255px-Daisy_Render_MP6_2.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Orange",
            "Green"
        ],
        "allegiances": ["Sarasaland"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Rosalina",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Rosalina",
        "imageLink": "https://mario.wiki.gallery/images/thumb/f/f3/SMG%2BSMG2_Rosalina.png/375px-SMG%2BSMG2_Rosalina.png",
        "firstAppearance": "smg-wii",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Turquoise",
            "Yellow"
        ],
        "allegiances": ["Comet Observatory"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Lakitu",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Lakitu",
        "imageLink": "https://mario.wiki.gallery/images/thumb/8/87/NSMBU_Lakitu_Artwork.png/330px-NSMBU_Lakitu_Artwork.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Yellow",
            "White"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Bowser Jr.",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Bowser_Jr.",
        "imageLink": "https://mario.wiki.gallery/images/thumb/f/f5/SMBW_Bowser_Jr_Artwork_1.png/450px-SMBW_Bowser_Jr_Artwork_1.png",
        "firstAppearance": "smss-gc",
        "lastAppearance": "yatmb-switch2",
        "colors": [
            "Green",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Birdo",
        "species": ["Birdo"],
        "description": "",
        "link": "https://www.mariowiki.com/Birdo",
        "imageLink": "https://mario.wiki.gallery/images/thumb/e/ed/MP9_Birdo_Main_Artwork.png/300px-MP9_Birdo_Main_Artwork.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Pink",
            "Red"
        ],
        "allegiances": ["8 Bits", "Other"],
        "playable": True,
        "tags": ["multi-colored"]
    },
    {
        "name": "King Boo",
        "species": ["Ghost"],
        "description": "",
        "link": "https://www.mariowiki.com/King_Boo",
        "imageLink": "https://mario.wiki.gallery/images/thumb/4/47/Mario_Party_Star_Rush_King_Boo.png/375px-Mario_Party_Star_Rush_King_Boo.png",
        "firstAppearance": "lm-gc",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "White",
            "Purple"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Donkey Kong",
        "species": ["Kong"],
        "description": "",
        "link": "https://www.mariowiki.com/Donkey_Kong",
        "imageLink": "https://mario.wiki.gallery/images/thumb/6/6e/DKB_Thinking_DK.png/450px-DKB_Thinking_DK.png",
        "firstAppearance": "dkc-snes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Brown",
            "Red"
        ],
        "allegiances": ["Kongs"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Spike",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Spike",
        "imageLink": "https://mario.wiki.gallery/images/thumb/2/20/Spike_-_Mario_Party_10.png/375px-Spike_-_Mario_Party_10.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Green",
            "Blue"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Cataquack",
        "species": ["Cataquack"],
        "description": "",
        "link": "https://www.mariowiki.com/Cataquack",
        "imageLink": "https://mario.wiki.gallery/images/0/04/CataquackSMG.png",
        "firstAppearance": "smss-gc",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Blue",
            "Yellow"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["multi-colored", "only-playable-in-mkw"]
    },
    {
        "name": "Pianta",
        "species": ["Pianta"],
        "description": "",
        "link": "https://www.mariowiki.com/Pianta",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/71/MSS_Pianta_Artwork.png/450px-MSS_Pianta_Artwork.png",
        "firstAppearance": "smss-gc",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Multi"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["multi-colored"]
    },
    {
        "name": "Rocky Wrench",
        "species": ["Mole"],
        "description": "",
        "link": "https://www.mariowiki.com/Rocky_Wrench",
        "imageLink": "https://mario.wiki.gallery/images/thumb/6/6c/RockyWrenchWorld.png/375px-RockyWrenchWorld.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Brown",
            "Grey"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Conkdor",
        "species": ["Conkdor"],
        "description": "",
        "link": "https://www.mariowiki.com/Conkdor",
        "imageLink": "https://mario.wiki.gallery/images/thumb/1/13/Conkdor_Artwork_-_Super_Mario_3D_World.png/225px-Conkdor_Artwork_-_Super_Mario_3D_World.png",
        "firstAppearance": "sm3dw-wiiu",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "White",
            "Pink"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Peepa",
        "species": ["Ghost"],
        "description": "",
        "link": "https://www.mariowiki.com/Peepa",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/78/MPSR_Artwork_-_Peepa.png/375px-MPSR_Artwork_-_Peepa.png",
        "firstAppearance": "sm3dl-3ds",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "White",
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Swoop",
        "species": ["Bat"],
        "description": "",
        "link": "https://www.mariowiki.com/Swoop",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/32/Swoop_SMR.png/375px-Swoop_SMR.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Blue",
            "Purple"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Coin Coffer",
        "species": ["Coin Coffer"],
        "description": "",
        "link": "https://www.mariowiki.com/Coin_Coffer",
        "imageLink": "https://mario.wiki.gallery/images/7/77/CoinCofferSM3DL.png",
        "firstAppearance": "sm3dl-3ds",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Green",
            "Yellow"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": ["multi-colored", "only-playable-in-mkw"]
    },
    {
        "name": "Dolphin",
        "species": ["Dolphin"],
        "description": "",
        "link": "https://www.mariowiki.com/Dolphin",
        "imageLink": "https://mario.wiki.gallery/images/a/a0/DMW-Dolphin.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Blue",
            "White"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Chargin' Chuck",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Chargin%27_Chuck",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/7c/MKT_Artwork_CharginChuck.png/375px-MKT_Artwork_CharginChuck.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Blue",
            "Orange"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Fish Bone",
        "species": ["Undead", "Fish"],
        "description": "",
        "link": "https://www.mariowiki.com/Fish_Bone",
        "imageLink": "https://mario.wiki.gallery/images/thumb/2/22/FishboneNSMBU.png/375px-FishboneNSMBU.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "White",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": ["only-playable-in-mkw"]
    },
    {
        "name": "Freezie",
        "species": ["Icicle"],
        "description": "",
        "link": "https://www.mariowiki.com/Freezie",
        "imageLink": "https://mario.wiki.gallery/images/e/e6/DMW-Freezie.png",
        "firstAppearance": "mb-arcade",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Blue"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Fighter Fly",
        "species": ["Fly"],
        "description": "",
        "link": "https://www.mariowiki.com/Fighter_Fly", 
        "imageLink": "https://mario.wiki.gallery/images/a/a3/MB_Fighter_Fly_Artwork.png",
        "firstAppearance": "mb-arcade",
        "lastAppearance": "mlssbm-3ds",
        "colors": [
            "Blue"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Eggplant Man",
        "species": ["Eggplant"],
        "description": "",
        "link": "https://www.mariowiki.com/Eggplant_Man",
        "imageLink": "https://mario.wiki.gallery/images/a/a6/CR_Asset_Model_Kid_Eggplant.png",
        "firstAppearance": "wc-nes",
        "lastAppearance": "wwt-gba",
        "colors": [
            "Purple",
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Foreman Spike",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Foreman_Spike",
        "imageLink": "https://mario.wiki.gallery/images/7/74/ForemanSpikeSprite.png",
        "firstAppearance": "wc-nes",
        "lastAppearance": "wwg-3ds",
        "colors": [
            "Black",
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Koopa Paratroopa",
        "species": ["Koopa", "Winged"],
        "description": "",
        "link": "https://www.mariowiki.com/Koopa_Paratroopa",
        "imageLink": "https://mario.wiki.gallery/images/thumb/d/d3/ParatroopaNSMB2.png/1024px-ParatroopaNSMB2.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Yellow",
            "Red"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Buzzy Beetle",
        "species": ["Koopa", "Beetle"],
        "description": "",
        "link": "https://www.mariowiki.com/Buzzy_Beetle",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/35/NSMBU_Buzzy_Beetle_Artwork.png/375px-NSMBU_Buzzy_Beetle_Artwork.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Dark Blue",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Spiny",
        "species": ["Koopa", "Beetle"],
        "description": "",
        "link": "https://www.mariowiki.com/Spiny",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/3e/Spiny_Artwork_-_New_Super_Mario_Bros._2.png/375px-Spiny_Artwork_-_New_Super_Mario_Bros._2.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Red",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Bullet Bill",
        "species": ["Ammunition"],
        "description": "",
        "link": "https://www.mariowiki.com/Bullet_Bill",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/36/MKW_Bullet_Bill_Roulette.png/375px-MKW_Bullet_Bill_Roulette.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "yatmb-switch2",
        "colors": [
            "Black"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Blooper",
        "species": ["Squid"],
        "description": "",
        "link": "https://www.mariowiki.com/Blooper",
        "imageLink": "https://mario.wiki.gallery/images/thumb/b/b5/Blooper_-_MarioPartyStarRush.png/300px-Blooper_-_MarioPartyStarRush.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "White",
            "Black"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Podoboo",
        "species": ["Fire"],
        "description": "",
        "link": "https://www.mariowiki.com/Lava_Bubble",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/7a/Lava_Bubble_SMR.png/225px-Lava_Bubble_SMR.png",
        "firstAppearance": "smb-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Orange",
            "Red"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Snifit",
        "species": ["Shy Guy"],
        "description": "",
        "link": "https://www.mariowiki.com/Snifit",
        "imageLink": "https://mario.wiki.gallery/images/thumb/5/5b/MPS_Model_Snifit.png/300px-MPS_Model_Snifit.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Red",
            "Black"
        ],
        "allegiances": ["8 Bits", "Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Ninji",
        "species": ["Ninji"],
        "description": "",
        "link": "https://www.mariowiki.com/Ninji",
        "imageLink": "https://mario.wiki.gallery/images/thumb/a/a4/Ninji_artwork_Play_Nintendo_2024.png/300px-Ninji_artwork_Play_Nintendo_2024.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Black",
            "Red"
        ],
        "allegiances": ["8 Bits", "Other"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Phanto",
        "species": ["Mask"],
        "description": "",
        "link": "https://www.mariowiki.com/Phanto",
        "imageLink": "https://mario.wiki.gallery/images/4/47/Madmask.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Red",
            "White"
        ],
        "allegiances": ["8 Bits", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Bob-omb",
        "species": ["Bomb"],
        "description": "",
        "link": "https://www.mariowiki.com/Bob-omb",
        "imageLink": "https://mario.wiki.gallery/images/thumb/9/9e/Bobomb_-_MarioPartyStarRush.png/375px-Bobomb_-_MarioPartyStarRush.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Black",
            "Gold"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Mouser",
        "species": ["Mouse"],
        "description": "",
        "link": "https://www.mariowiki.com/Mouser",
        "imageLink": "https://mario.wiki.gallery/images/7/7a/SMB2_Gray_Mouser_Sprite.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "sma-gba",
        "colors": [
            "Grey",
            "Pink"
        ],
        "allegiances": ["8 Bits"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Cobrat",
        "species": ["Snake"],
        "description": "",
        "link": "https://www.mariowiki.com/Cobrat",
        "imageLink": "https://mario.wiki.gallery/images/b/ba/Cobrat_SMB2_Sprite.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "mpl-gba",
        "colors": [
            "Red",
        ],
        "allegiances": ["8 Bits"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Tryclyde",
        "species": ["Snake"],
        "description": "",
        "link": "https://www.mariowiki.com/Tryclyde",
        "imageLink": "https://mario.wiki.gallery/images/2/23/Tryclyde_SMB2_NES_sprite.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "sma-gba",
        "colors": [
            "Red",
        ],
        "allegiances": ["8 Bits"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Fryguy",
        "species": ["Fire"],
        "description": "",
        "link": "https://www.mariowiki.com/Fryguy",
        "imageLink": "https://mario.wiki.gallery/images/2/2d/Fryguy_SMB2_Sprite.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "sma-gba",
        "colors": [
            "Red",
            "Yellow"
        ],
        "allegiances": ["8 Bits"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Clawgrip",
        "species": ["Crab"],
        "description": "",
        "link": "https://www.mariowiki.com/Clawgrip",
        "imageLink": "https://mario.wiki.gallery/images/thumb/0/0c/SMA_Clawgrip_Artwork.png/450px-SMA_Clawgrip_Artwork.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "sma-gba",
        "colors": [
            "Orange",
            "Yellow"
        ],
        "allegiances": ["8 Bits"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Wart",
        "species": ["Toad"],
        "description": "",
        "link": "https://www.mariowiki.com/Wart",
        "imageLink": "https://mario.wiki.gallery/images/thumb/4/40/SMA_Wart_Artwork.png/375px-SMA_Wart_Artwork.png",
        "firstAppearance": "smb2-nes",
        "lastAppearance": "sma-gba",
        "colors": [
            "Green",
            "White"
        ],
        "allegiances": ["8 Bits"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Boomerang Bro",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Boomerang_Bro",
        "imageLink": "https://mario.wiki.gallery/images/thumb/8/82/NSMBU_Boomerang_Bro_Artwork.png/450px-NSMBU_Boomerang_Bro_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Blue",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Fire Bro",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Fire_Bro",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/3d/NSMBU_Fire_Bro_Artwork.png/450px-NSMBU_Fire_Bro_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Red",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Sledge Bro",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Sledge_Bro",
        "imageLink": "https://mario.wiki.gallery/images/9/92/DMW-SledgeBro.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Green",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Buster Beetle",
        "species": ["Koopa", "Beetle"],
        "description": "",
        "link": "https://www.mariowiki.com/Buster_Beetle",
        "imageLink": "https://mario.wiki.gallery/images/b/b9/SMB3_Sprite_Buster_Beetle.png",
        "firstAppearance": "smb3-nes",
        "colors": [
            "Black",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Para-Beetle",
        "species": ["Koopa", "Winged", "Beetle"],
        "description": "",
        "link": "https://www.mariowiki.com/Para-Beetle",
        "imageLink": "https://mario.wiki.gallery/images/thumb/f/f4/NSMBW_Asset_Model_Para-Beetle.png/180px-NSMBW_Asset_Model_Para-Beetle.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Red",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Fire Piranha Plant",
        "species": ["Plant"],
        "description": "",
        "link": "https://www.mariowiki.com/Fire_Piranha_Plant",
        "imageLink": "https://mario.wiki.gallery/images/thumb/0/09/FirepiranhaNSMBU.png/1280px-FirepiranhaNSMBU.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Red",
            "White",
            "Green"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Ptooie",
        "species": ["Plant"],
        "description": "",
        "link": "https://www.mariowiki.com/Ptooie",
        "imageLink": "https://mario.wiki.gallery/images/thumb/1/1e/SMB3_F40A_Ptooie_Artwork.png/121px-SMB3_F40A_Ptooie_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Red",
            "White",
            "Green"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Muncher",
        "species": ["Plant"],
        "description": "",
        "link": "https://www.mariowiki.com/Muncher",
        "imageLink": "https://mario.wiki.gallery/images/0/0f/SMM-NSMBU-Muncher.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Black",
            "Orange"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Fire Snake",
        "species": ["Fire"],
        "description": "",
        "link": "https://www.mariowiki.com/Fire_Snake",
        "imageLink": "https://mario.wiki.gallery/images/thumb/1/16/NSMBU_Asset_Model_Fire_Snake.png/300px-NSMBU_Asset_Model_Fire_Snake.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Red",
            "Orange"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Boo",
        "species": ["Ghost"],
        "description": "",
        "link": "https://www.mariowiki.com/Boo",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/3f/MPS_Boo_Artwork.png/375px-MPS_Boo_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "White",
            "Pink"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Stretch",
        "species": ["Ghost"],
        "description": "",
        "link": "https://www.mariowiki.com/Stretch",
        "imageLink": "https://mario.wiki.gallery/images/6/66/Stretch_SMR.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smm2-switch",
        "colors": [
            "White",
            "Pink"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Thwomp",
        "species": ["Stone"],
        "description": "",
        "link": "https://www.mariowiki.com/Thwomp",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/34/NSMBU_Thwomp_Artwork.png/1280px-NSMBU_Thwomp_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Grey"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Chain Chomp",
        "species": ["Ball & Chain"],
        "description": "",
        "link": "https://www.mariowiki.com/Chain_Chomp",
        "imageLink": "https://mario.wiki.gallery/images/thumb/a/a9/ChainChompMP8.png/450px-ChainChompMP8.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Black",
            "White"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Angry Sun",
        "species": ["Sun"],
        "description": "",
        "link": "https://www.mariowiki.com/Angry_Sun",
        "imageLink": "https://mario.wiki.gallery/images/d/da/SMB3_Sprite_Angry_Sun.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smm2-switch",
        "colors": [
            "Orange",
            "Yellow"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Jelectro",
        "species": ["Jellyfish"],
        "description": "",
        "link": "https://www.mariowiki.com/Jelectro",
        "imageLink": "https://mario.wiki.gallery/images/a/a5/SMB3_Sprite_Jelectro.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smm2-switch",
        "colors": [
            "Black",
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Flame Chomp",
        "species": ["Ball & Chain", "Fire"],
        "description": "",
        "link": "https://www.mariowiki.com/Flame_Chomp",
        "imageLink": "https://mario.wiki.gallery/images/b/bd/FlameChompNSMBW.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Black",
            "Orange"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Spiny Cheep Cheep",
        "species": ["Fish"],
        "description": "",
        "link": "https://www.mariowiki.com/Spiny_Cheep_Cheep",
        "imageLink": "https://mario.wiki.gallery/images/thumb/a/ae/NSMBU_Spiny_Cheep_Artwork.png/375px-NSMBU_Spiny_Cheep_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "mlssbm-3ds",
        "colors": [
            "Purple",
            "White"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Boom Boom",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Boom_Boom",
        "imageLink": "https://mario.wiki.gallery/images/thumb/f/f0/Boom_Boom_SMR.png/450px-Boom_Boom_SMR.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Yellow",
            "Red"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Larry Koopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Larry",
        "imageLink": "https://mario.wiki.gallery/images/thumb/1/18/NSMBU_Larry_Koopa_Artwork.png/300px-NSMBU_Larry_Koopa_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Blue",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Morton Koopa Jr.",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Morton",
        "imageLink": "https://mario.wiki.gallery/images/thumb/e/eb/MKT_Artwork_Morton.png/450px-MKT_Artwork_Morton.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Black",
            "Grey"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Wendy O. Koopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Wendy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/9/95/NSMBW_Wendy_Artwork.png/375px-NSMBW_Wendy_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Pink",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Iggy Koopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Iggy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/c/c0/NSMBU_Iggy_Artwork.png/300px-NSMBU_Iggy_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Green",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Roy Koopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Roy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/6/67/NSMBW_Roy_Artwork.png/375px-NSMBW_Roy_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Magenta",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Lemmy Koopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Lemmy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/8/84/NSMBW_Lemmy_Artwork.png/225px-NSMBW_Lemmy_Artwork.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Orange",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Ludwig von Koopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Ludwig",
        "imageLink": "https://mario.wiki.gallery/images/thumb/8/8e/LudwigNSMBU.png/375px-LudwigNSMBU.png",
        "firstAppearance": "smb3-nes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Blue",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Dr. Mario",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Dr._Mario",
        "imageLink": "https://www.mariowiki.com/File:Dr_Mario_DMW.png",
        "firstAppearance": "dm-nes",
        "lastAppearance": "wwmi-switch",
        "colors": [
            "White",
        ],
        "allegiances": ["Mushroom Kingdom"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Virus",
        "species": ["Virus"],
        "description": "",
        "link": "https://www.mariowiki.com/Virus",
        "imageLink": "https://mario.wiki.gallery/images/thumb/d/df/SSBU_Viruses_Spirit.png/181px-SSBU_Viruses_Spirit.png",
        "firstAppearance": "dm-nes",
        "lastAppearance": "wwmi-switch",
        "colors": [
            "Multi",
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Galoomba",
        "species": ["Goomba"],
        "description": "",
        "link": "https://www.mariowiki.com/Galoomba",
        "imageLink": "https://mario.wiki.gallery/images/b/b3/Galoomba_-_Mario_Party_10.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Brown",
            "Green"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Fuzzy",
        "species": ["Fuzzy"],
        "description": "",
        "link": "https://www.mariowiki.com/Fuzzy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/75/NSMBU_Fuzzy_Artwork.png/375px-NSMBU_Fuzzy_Artwork.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Black",
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Sumo Bro",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Sumo_Bro",
        "imageLink": "https://mario.wiki.gallery/images/thumb/d/dd/NSMBU_Sumo_Bro_Artwork.png/375px-NSMBU_Sumo_Bro_Artwork.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Brown",
            "Black"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Rex",
        "species": ["Dinosaur"],
        "description": "",
        "link": "https://www.mariowiki.com/Rex",
        "imageLink": "https://mario.wiki.gallery/images/0/0c/MLSSBMRex.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mlssbm-3ds",
        "colors": [
            "Blue",
            "Yellow"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Dino Rhino",
        "species": ["Dinosaur"],
        "description": "",
        "link": "https://www.mariowiki.com/Dino_Rhino",
        "imageLink": "https://mario.wiki.gallery/images/3/30/DinoRhino_SMW.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "pmtok-switch",
        "colors": [
            "Green",
            "Pink"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Dino-torch",
        "species": ["Dinosaur"],
        "description": "",
        "link": "https://www.mariowiki.com/Dino-Torch",
        "imageLink": "https://mario.wiki.gallery/images/7/79/Dino-Torch_SMW_fire-breathing_sprite.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smwsma2-gba",
        "colors": [
            "Green",
            "Pink"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Super Koopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Super_Koopa",
        "imageLink": "https://mario.wiki.gallery/images/8/87/SMW_SuperKoopa_Green.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Yellow",
            "Red"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Bomber Bill",
        "species": ["Ammunition"],
        "description": "",
        "link": "https://www.mariowiki.com/Bomber_Bill",
        "imageLink": "https://mario.wiki.gallery/images/thumb/2/2b/BanzaibillNSMBU.png/450px-BanzaibillNSMBU.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "yatmb-switch2",
        "colors": [
            "Black"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Torpedo Ted",
        "species": ["Ammunition"],
        "description": "",
        "link": "https://www.mariowiki.com/Torpedo_Ted",
        "imageLink": "https://mario.wiki.gallery/images/thumb/b/bd/Torpedo_Ted_-_NSMBU_%28render%29.png/300px-Torpedo_Ted_-_NSMBU_%28render%29.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Black"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Spike Top",
        "species": ["Koopa", "Beetle"],
        "description": "",
        "link": "https://www.mariowiki.com/Spike_Top",
        "imageLink": "https://mario.wiki.gallery/images/thumb/c/cb/Super_Mario_Party_-_Spike_Top.png/233px-Super_Mario_Party_-_Spike_Top.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "wwgit-switch",
        "colors": [
            "Red",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Blargg",
        "species": ["Fire", "Dinosaur"],
        "description": "",
        "link": "https://www.mariowiki.com/Blargg",
        "imageLink": "https://mario.wiki.gallery/images/9/99/SMA2_Blargg_sprite.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smwsma2-gba",
        "colors": [
            "Red",
            "Orange"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Porcupuffer",
        "species": ["Fish"],
        "description": "",
        "link": "https://www.mariowiki.com/Porcupuffer",
        "imageLink": "https://www.mariowiki.com/File:NSMBU_Porcupuffer_Artwork.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Purple",
            "Yellow"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Urchin",
        "species": ["Urchin"],
        "description": "",
        "link": "https://www.mariowiki.com/Urchin",
        "imageLink": "https://mario.wiki.gallery/images/thumb/4/48/NSMBU_Urchin_Artwork.png/375px-NSMBU_Urchin_Artwork.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Purple",
            "Yellow"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Eerie",
        "species": ["Dinosaur", "Ghost"],
        "description": "",
        "link": "https://www.mariowiki.com/Eerie",
        "imageLink": "https://mario.wiki.gallery/images/8/81/Eerie.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smwsma2-gba",
        "colors": [
            "Light Blue",
            "White"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Bony Beetle",
        "species": ["Undead", "Koopa", "Beetle"],
        "description": "",
        "link": "https://www.mariowiki.com/Bony_Beetle",
        "imageLink": "https://mario.wiki.gallery/images/thumb/6/61/NSMBU_Bony_Beetle_Artwork.png/300px-NSMBU_Bony_Beetle_Artwork.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mgsr-switch",
        "colors": [
            "Grey",
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Thwimp",
        "species": ["Stone"],
        "description": "",
        "link": "https://www.mariowiki.com/Thwimp",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/7e/NSMBU_Thwimp_Model.png/300px-NSMBU_Thwimp_Model.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "mvdk-switch",
        "colors": [
            "Grey",
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Magikoopa",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Magikoopa",
        "imageLink": "https://mario.wiki.gallery/images/thumb/7/79/Magikoopa_Artwork_-_Super_Mario_3D_World.png/288px-Magikoopa_Artwork_-_Super_Mario_3D_World.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Blue",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Kamek",
        "species": ["Koopa"],
        "description": "",
        "link": "https://www.mariowiki.com/Kamek",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/3c/SMPJ_Kamek_Artwork.png/450px-SMPJ_Kamek_Artwork.png",
        "firstAppearance": "smw2yi-snes",
        "lastAppearance": "yatmb-switch2",
        "colors": [
            "Blue",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": True,
        "tags": []
    },
    {
        "name": "Mechakoopa",
        "species": ["Mechanical"],
        "description": "",
        "link": "https://www.mariowiki.com/Mechakoopa",
        "imageLink": "https://mario.wiki.gallery/images/f/f2/SMW_Artwork_Mechakoopa.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "Green",
            "Yellow"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Reznor",
        "species": ["Dinosaur"],
        "description": "",
        "link": "https://www.mariowiki.com/Reznor",
        "imageLink": "https://mario.wiki.gallery/images/1/15/Reznor_SMW_sprite.png",
        "firstAppearance": "smw-snes",
        "lastAppearance": "nsmb2-3ds",
        "colors": [
            "Grey",
            "White"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Gao",
        "species": ["Sphinx"],
        "description": "",
        "link": "https://www.mariowiki.com/Gao",
        "imageLink": "https://mario.wiki.gallery/images/c/c1/Gao_SML_art.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "sml-gb",
        "colors": [
            "Yellow",
        ],
        "allegiances": ["Sarasaland"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Yurarin",
        "species": ["Seahorse"],
        "description": "",
        "link": "https://www.mariowiki.com/Yurarin",
        "imageLink": "https://mario.wiki.gallery/images/a/a0/SML_Yurarin_Alternate_Artwork.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "sml-gb",
        "colors": [
            "Pink",
        ],
        "allegiances": ["Sarasaland"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Tokotoko",
        "species": ["Moai"],
        "description": "",
        "link": "https://www.mariowiki.com/Tokotoko",
        "imageLink": "https://mario.wiki.gallery/images/0/09/Tokotokoartwork.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Yellow",
        ],
        "allegiances": ["Sarasaland"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Batadon",
        "species": ["Moai", "Winged"],
        "description": "",
        "link": "https://www.mariowiki.com/Batadon",
        "imageLink": "https://mario.wiki.gallery/images/7/73/SML_Batadon_Alternate_Artwork.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Yellow",
        ],
        "allegiances": ["Sarasaland"],
        "playable": False,
        "tags": []
    },
    {
        "name": "King Totomesu",
        "species": ["Sphinx"],
        "description": "",
        "link": "https://www.mariowiki.com/King_Totomesu",
        "imageLink": "https://mario.wiki.gallery/images/thumb/6/61/SML_KingTotomesu_Artwork.png/420px-SML_KingTotomesu_Artwork.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "sml-gb",
        "colors": [
            "Yellow",
            "Orange"
        ],
        "allegiances": ["Sarasaland"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Dragonzamasu",
        "species": ["Seahorse"],
        "description": "",
        "link": "https://www.mariowiki.com/Dragonzamasu",
        "imageLink": "https://mario.wiki.gallery/images/7/7b/SML_Dragonzamasu_Artwork.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "sml-gb",
        "colors": [
            "Yellow",
        ],
        "allegiances": ["Sarasaland"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Hiyoihoi",
        "species": ["Moai"],
        "description": "",
        "link": "https://www.mariowiki.com/Hiyoihoi",
        "imageLink": "https://mario.wiki.gallery/images/d/dc/SML_Hiyoihoi_Alternate_Artwork.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "sml-gb",
        "colors": [
            "Yellow",
        ],
        "allegiances": ["Sarasaland"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Biokinton",
        "species": ["Cloud"],
        "description": "",
        "link": "https://www.mariowiki.com/Biokinton",
        "imageLink": "https://mario.wiki.gallery/images/9/9b/SML_Biokinton_Alternate_Artwork.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "sml-gb",
        "colors": [
            "White",
        ],
        "allegiances": ["Sarasaland"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Tatanga",
        "species": ["Alien"],
        "description": "",
        "link": "https://www.mariowiki.com/Tatanga",
        "imageLink": "https://mario.wiki.gallery/images/thumb/1/14/Tatanga_in_Pagosu.png/270px-Tatanga_in_Pagosu.png",
        "firstAppearance": "sml-gb",
        "lastAppearance": "sml26gc-gb",
        "colors": [
            "Purple",
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Wanda",
        "species": ["Fairy"],
        "description": "",
        "link": "https://www.mariowiki.com/Wanda",
        "imageLink": "https://mario.wiki.gallery/images/thumb/8/8a/SSBU_Wanda_Spirit.png/300px-SSBU_Wanda_Spirit.png",
        "firstAppearance": "mw-snes",
        "lastAppearance": "mw-snes",
        "colors": [
            "Red",
            "Pink"
        ],
        "allegiances": ["Other"],
        "playable": True,
        "tags": []
    },
    {
        "name": "King Fret",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/King_Fret",
        "imageLink": "https://mario.wiki.gallery/images/d/d1/Safari_Fret.png",
        "firstAppearance": "ys-snes",
        "lastAppearance": "ys-snes",
        "colors": [
            "Red",
            "White"
        ],
        "allegiances": ["Jewelry Land"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Prince Pine",
        "species": ["Human"],
        "description": "",
        "link": "https://www.mariowiki.com/Prince_Pine",
        "imageLink": "https://mario.wiki.gallery/images/6/69/Safari_Prince_Pine.png",
        "firstAppearance": "ys-snes",
        "lastAppearance": "ys-snes",
        "colors": [
            "Blue",
        ],
        "allegiances": ["Jewelry Land"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Poochy",
        "species": ["Dog"],
        "description": "",
        "link": "https://www.mariowiki.com/Poochy",
        "imageLink": "https://mario.wiki.gallery/images/thumb/e/e5/MKT_Artwork_Poochy.png/300px-MKT_Artwork_Poochy.png",
        "firstAppearance": "smw2yi-snes",
        "lastAppearance": "smbwns2emibp-switch2",
        "colors": [
            "White",
            "Brown"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Whomp",
        "species": ["Stone"],
        "description": "",
        "link": "https://www.mariowiki.com/Whomp",
        "imageLink": "https://mario.wiki.gallery/images/thumb/d/de/WhompSMP.png/375px-WhompSMP.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Grey",
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Unagi",
        "species": ["Fish"],
        "description": "",
        "link": "https://www.mariowiki.com/Maw-Ray",
        "imageLink": "https://mario.wiki.gallery/images/thumb/8/8d/Maw-Ray_Icon_SMO.png/300px-Maw-Ray_Icon_SMO.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "smo-switch",
        "colors": [
            "Red",
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Spindrift",
        "species": ["Plant"],
        "description": "",
        "link": "https://www.mariowiki.com/Spindrift",
        "imageLink": "https://mario.wiki.gallery/images/thumb/6/6b/Spindriftmario64ds.png/300px-Spindriftmario64ds.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "sm3das-switch",
        "colors": [
            "Pink",
            "Yellow",
            "Green"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Mr. Blizzard",
        "species": ["Snowpeople"],
        "description": "",
        "link": "https://www.mariowiki.com/Mr._Blizzard",
        "imageLink": "https://mario.wiki.gallery/images/thumb/3/39/MP9_Mr_Blizzard_Render.png/236px-MP9_Mr_Blizzard_Render.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "mgsr-switch",
        "colors": [
            "White",
            "Blue"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Scuttlebug",
        "species": ["Bug"],
        "description": "",
        "link": "https://www.mariowiki.com/Scuttlebug",
        "imageLink": "https://mario.wiki.gallery/images/thumb/c/c8/SMR_Art_-_Scuttlebug.png/300px-SMR_Art_-_Scuttlebug.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "mtf-switch2",
        "colors": [
            "Purple",
            "Yellow"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Mr. I",
        "species": ["Eyeball"],
        "description": "",
        "link": "https://www.mariowiki.com/Mr._I",
        "imageLink": "https://mario.wiki.gallery/images/thumb/b/b5/MPS_Mr_I_enc.png/300px-MPS_Mr_I_enc.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "mps-switch",
        "colors": [
            "White",
            "Blue"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Mad Piano",
        "species": ["Piano"],
        "description": "",
        "link": "https://www.mariowiki.com/Mad_Piano",
        "imageLink": "https://mario.wiki.gallery/images/thumb/1/13/SM64DS_Model_Mad_Piano.png/243px-SM64DS_Model_Mad_Piano.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "sm3das-switch",
        "colors": [
            "Black",
            "Red"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Bully",
        "species": ["Bully"],
        "description": "",
        "link": "https://www.mariowiki.com/Bully",
        "imageLink": "https://mario.wiki.gallery/images/thumb/c/c4/Bully_Artwork_-_Super_Mario_3D_World.png/375px-Bully_Artwork_-_Super_Mario_3D_World.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "mkw-switch2",
        "colors": [
            "Dark Blue",
            "Black"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Tox Box",
        "species": ["Stone"],
        "description": "",
        "link": "https://www.mariowiki.com/Tox_Box",
        "imageLink": "https://mario.wiki.gallery/images/c/ce/Tox_Box_SMG.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Grey",
            "Red"
        ],
        "allegiances": ["Koopatroop"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Kelpto",
        "species": ["Bird"],
        "description": "",
        "link": "https://www.mariowiki.com/Klepto",
        "imageLink": "https://mario.wiki.gallery/images/thumb/b/ba/Klepto_Icon_SMO.png/405px-Klepto_Icon_SMO.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "msbl-switch",
        "colors": [
            "Brown",
            "Black"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Sushi",
        "species": ["Fish"],
        "description": "",
        "link": "https://www.mariowiki.com/Sushi",
        "imageLink": "https://mario.wiki.gallery/images/thumb/8/87/DMW-Sushi.png/375px-DMW-Sushi.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Blue",
            "White"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Skeeter",
        "species": ["Bug"],
        "description": "",
        "link": "https://www.mariowiki.com/Skeeter",
        "imageLink": "https://mario.wiki.gallery/images/thumb/1/1e/Skeeterartwork_SMG2.png/300px-Skeeterartwork_SMG2.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Purple",
            "Yellow"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Chuckya",
        "species": ["Bomb"],
        "description": "",
        "link": "https://www.mariowiki.com/Chuckya",
        "imageLink": "https://mario.wiki.gallery/images/thumb/5/5a/SM64DS_Model_Chuckya.png/276px-SM64DS_Model_Chuckya.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "sm3das-switch",
        "colors": [
            "Purple",
            "Red"
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Ukiki",
        "species": ["Monkey"],
        "description": "",
        "link": "https://www.mariowiki.com/Ukiki",
        "imageLink": "https://mario.wiki.gallery/images/3/33/MPS_Ukiki_enc.png",
        "firstAppearance": "smw2yi-snes",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Brown",
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "King Bob-omb",
        "species": ["Bomb"],
        "description": "",
        "link": "https://www.mariowiki.com/King_Bob-omb",
        "imageLink": "https://mario.wiki.gallery/images/thumb/f/f1/SMP_-_King_Bob-omb.png/450px-SMP_-_King_Bob-omb.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "smpjns2ejt-switch2",
        "colors": [
            "Black",
            "White"
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Whomp King",
        "species": ["Stone"],
        "description": "",
        "link": "https://www.mariowiki.com/Whomp_King",
        "imageLink": "https://mario.wiki.gallery/images/3/3c/DMW-WhompKing.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "smgsmg2-switch",
        "colors": [
            "Grey",
        ],
        "allegiances": ["Koopatroop", "Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "Eyerok",
        "species": ["Stone"],
        "description": "",
        "link": "https://www.mariowiki.com/Eyerok",
        "imageLink": "https://mario.wiki.gallery/images/thumb/f/f0/Eyerock_Model_SM64.png/300px-Eyerock_Model_SM64.png",
        "firstAppearance": "sm64-n64",
        "lastAppearance": "sm3das-switch",
        "colors": [
            "Yellow",
        ],
        "allegiances": ["Other"],
        "playable": False,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
    {
        "name": "",
        "species": [""],
        "description": "",
        "link": "",
        "imageLink": "",
        "firstAppearance": "",
        "lastAppearance": "",
        "colors": [
            "",
            ""
        ],
        "allegiances": [],
        "playable": True,
        "tags": []
    },
]

for c in characters:
    cid = re.sub(r'[^a-zA-Z0-9 ]', '', c['name']).lower().replace(' ', '-')
    c['id'] = cid

with open("characters.json5", 'w') as f:
    json.dump(characters, f, indent=4)
