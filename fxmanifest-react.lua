fx_version 'cerulean'
game 'gta5'

author 'Case @ Playing In Traffic'
description 'MGC Minigame Collection - React UI'
version '2.0.0'

-- Client Scripts
client_scripts {
    'core/client.lua',
}

-- UI Files (React Build)
ui_page 'ui-dist/index.html'

files {
    'ui-dist/index.html',
    'ui-dist/assets/**/*',
}

-- Exports
exports {
    'start_game',
}

lua54 'yes'
