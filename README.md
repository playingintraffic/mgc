![MINIGAMES_THUMB](https://github.com/user-attachments/assets/5c0586cc-9902-40f7-9201-a699c8ff7a4a)

# [YouTube](https://www.youtube.com/watch?v=WYHuuy1pDM0)

# MGC - Minigame Collection

The minigame goat is back.  

The original pack? Iconic.
Still running on 2,000+ servers and proving that simple design done right lasts forever.
But time moves on and so did the tech, the visuals, and the standard I hold myself to.
So I started fresh. Every game, reimagined from the ground up with modern UI, smoother flow, and that unmistakable PIT touch. 

Welcome to MGC. 
Twenty handcrafted skill challenges under one clean system.
Every click, every beat, every "oh shit" moment fine-tuned to hit harder and feel better.
For the devs who care about polish, and the players who can't stop chasing perfection.

## Overview

This isn't some "press E to win" collection.  
It's a full on sandbox of logic, reflex, memory, and timing designed to slot anywhere: hacking jobs, heists, crafting, torture-testing your friends, whatever.

* 20 unique minigames - all new, all rebuilt  
* Unified callback system - one export, one return, zero headaches  
* Standalone & framework-ready - works with QBCore, ESX, or that weird custom core you swear is "better"  
* Shared UI theme, fonts, and sounds - everything finally matches  
* Configurable, lightweight, and aggressively optimized  

You want clean, fast, and consistent?  
You got it.  

## Included Games

**Logic:** Anagram, Tile Shift, Bit Flip, Circuit Trace  
**Reflex:** Whack Flash, Button Mash, Key Drop, Code Drop  
**Timing:** Skill Bar, Skill Circle, Pulse Sync, Signal Wave  
**Puzzle:** Chip Hack, Pattern Lock, Safe Crack, Pincode  
**Special:** Wire Cut, Packet Snatch, Frequency Jam, Hangman  

Twenty games.  
One consistent system.  
Zero excuses for lazy design.

## Quick Start

```lua
exports.mgc:start_game({
    game = 'signal_wave', -- or any of the other 20 games
    data = { difficulty = 3 } -- refer to docs for per game settings
}, function(result)
    if result.success then
        print(('Game %s completed successfully'):format(result.game))
    else
        print(('Game %s failed'):format(result.game))
    end
end)
```

It's that simple.
All games fire back the same payload. 
No undocumented voodoo, no extra events, no mystery variables called `xD_please_work`.

## Why You Want This

* Because your players deserve more than the same recycled games.
* Because every server's still running the old pack like it's vintage.
* Because a minigame shouldn't freeze your entire UI when someone blinks.
* Because it's not "just another hack game" it's twenty reasons to stop using the same shite.
* Because consistency is sexy.

## Install

1. Drop MGC into your `resources/` folder.
2. Add `ensure minigames` to your `server.cfg`.
3. Call the export whenever you want chaos.
4. Watch your logs light up with success messages instead of Lua errors.

## For Server Owners

> Still using `boii_minigames`? That's adorable.
> Pit Minigames is the trusted upgrade same spirit, new code, zero bullshit.

Drop it in, call the export, and watch your players rage-quit responsibly.

## For Script Devs

> Need help swapping from `boii_minigames` to this version?
> Want to just flex some new games? 

Give me a shout if im around I can help.

## Support

Can't beat a game?
Want to complain about one being too hard? 
Join the discord.

**[Join the PIT Discord](https://discord.gg/MUckUyS5Kq)**

> Support Hours: **Mon–Fri, 10AM–10PM GMT**  
> Outside that? Shout at the moon, sacrifice a chicken? Or just be patient and wait for someone to be around.
