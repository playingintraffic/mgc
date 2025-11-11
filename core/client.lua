--[[ 
    This file is part of MGC and is licensed under the MIT License.
    See the LICENSE file in the root directory for full terms.

    © 2025 Case @ Playing In Traffic

    Support honest development - retain this credit. Don't be that guy...
]]

--- @script core.client
--- @description Handles starting games, callbacks etc.

local is_busy = false
local current_cb = nil

--- @section Functions

local function start_game(data, cb)
    if is_busy then return print("Already running a game, wait until it finishes.") end

    if not data or not data.game then return print("Missing game name in data.") end
    if not cb then return print("Callback must be included to return success state.") end

    is_busy = true
    current_cb = cb

    SetNuiFocus(true, true) 
    SendNUIMessage({
        action = "start_minigame",
        game = data.game,
        data = data.data or {}
    })
end

exports("start_game", start_game)

--- @section NUI Callbacks

RegisterNUICallback("minigame_result", function(data, cb)
    if not data or not data.game then print("Invalid NUI result data (missing game).") return cb("error") end

    if IsNuiFocused() then
        SetNuiFocus(false, false)
    end

    is_busy = false

    if current_cb then
        current_cb(data)
        current_cb = nil
    end

    cb("ok")
end)

RegisterNUICallback("clear_focus", function()
    if IsNuiFocused() then
        SetNuiFocus(false, false)
    end
end)

--- @section Testing Command

RegisterCommand("test_minigame", function(_, args)
    local game = args[1] or "anagram"

    exports.mgc:start_game({
        game = game,
    }, function(result)
        if not result then return print("No result received.") end

        if result.success then
            print(("Game '%s' completed successfully."):format(result.game))
        else
            print(("Game '%s' failed."):format(result.game))
        end
    end)
end)