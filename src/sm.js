"use strict";

var PULSE  = 0;
var PPS = 16;
var BLOCKS = null;
var BLOCK_ID = 1;
var BLOCK_TIME = 0.125; // seconds
var BPS = 0;

var POOLS = {
    HM : {
        HPP     : 66,
        bonus   : 0,
        ansi    : "\x1b[32mHonestMinings",
        blocks  : null,
        selfish : false
    },
    SM : {
        HPP     : 33,
        bonus   : 0,
        ansi    : "\x1b[1;31mS\x1b[22;31mhell\x1b[1;31mF\x1b[22;31mish\x1b[1;34mP\x1b[22;34mool\x1b[31m",
        blocks  : null,
        score   : 0,
        selfish : true
    }
};

function create_block() {
    var block = {
        id     : BLOCK_ID++,
        hash   : 0,
        salt   : "",
        pool   : "",
        diff   : 0,
        time   : PULSE,
        height : 0,
        next   : null
    };

    return block;
}

function set_blockchain(pool) {
    if (POOLS[pool].blocks === null) POOLS[pool].blocks = BLOCKS;
    if (POOLS[pool].selfish) {
        return;
    }
    if (BLOCKS.height < POOLS[pool].blocks.height) {
        BLOCKS = POOLS[pool].blocks;
    }
    else app_receive_output(POOLS[pool].ansi+" \x1b[1;31m attempts to overwrite the block chain with a block of a lower height.\x1b[0m\n");
}

function get_blockchain(pool) {
    if (POOLS[pool].blocks === null) {
        POOLS[pool].blocks = BLOCKS;
    }
    else if (POOLS[pool].blocks.height < BLOCKS.height) {
        if ("score" in POOLS[pool] && POOLS[pool].score > 0) {
            app_receive_output(POOLS[pool].ansi+" \x1b[1;36mdiscards work at block "+POOLS[pool].blocks.id+" and starts mining from "+BLOCKS.id+".\x1b[0m\n");
        }
        POOLS[pool].blocks = BLOCKS;
        POOLS[pool].score = 0;
    }
    else if (POOLS[pool].selfish) {
        var old_score = POOLS[pool].score;
        var new_score = POOLS[pool].blocks.height - BLOCKS.height;
        if (new_score < old_score) {
            if (old_score === 1) {
                if ("score" in POOLS[pool] && POOLS[pool].score > 0) {
                    app_receive_output(POOLS[pool].ansi+" \x1b[1;36mrejects work at block "+POOLS[pool].blocks.id+" and starts mining from "+BLOCKS.id+".\x1b[0m\n");
                }
                POOLS[pool].blocks = BLOCKS;
                POOLS[pool].score = 0;
            }
            else {
                var blocks = POOLS[pool].blocks;
                var reveal_to = null;
                while (blocks !== null) {
                    if (blocks.height === BLOCKS.height) {
                        break;
                    }
                    reveal_to = blocks;
                    blocks = blocks.next;
                }

                var reveal_from = reveal_to;
                var reveal_count = (reveal_to ? 1 : 0);
                while (reveal_from !== null) {
                    if (reveal_from.next !== null
                    &&  BLOCKS.next      !== null
                    &&  reveal_from.next.id === BLOCKS.next.id) {
                        break;
                    }
                    reveal_from = reveal_from.next;
                    reveal_count++;
                }

                BLOCKS = (reveal_to !== null ? reveal_to : POOLS[pool].blocks);
                POOLS[pool].score = (reveal_to !== null ? (POOLS[pool].score - reveal_count)  : 0);
                var share = 0;

                // Let's calculate the percentage of SM's blocks...
                {
                    var block = BLOCKS;
                    var i  = 0;
                    var shares = {};
                    for (i=0; i<14400; ++i) {
                        if (block === null) break;

                        if (block.pool in shares) shares[block.pool]++;
                        else                      shares[block.pool] = 1;

                        block = block.next;
                    }

                    for (var key in shares) {
                        if (shares.hasOwnProperty(key) && i > 0 && key in POOLS) {
                            shares[key] = Math.round(100*(shares[key]/i));
                        }
                    }
                    share = ( pool in shares ? shares[pool] : 0 );
                }
                if (reveal_to === null) reveal_count = old_score;
                app_receive_output(POOLS[pool].ansi+" \x1b[1;31mreveals "+reveal_count+" hidden block"+(reveal_count == 1 ? "" : "s")+" and has mined "+share+"% of blocks!!!\x1b[0m\n");
            }
        }
    }

    return POOLS[pool].blocks;
}

function calc_diff(blocks) {
    var W = 0;

    var block = blocks;
    var t1 = (-1 >>> 0);
    var t2 = PULSE;
    var i  = 0;
    for (i=0; i<144; ++i) {
        if (block === null) break;

        W += block.diff;
        t1 = Math.min(block.time, t1);
        t2 = Math.max(block.time, t2);

        block = block.next;
    }

    var dt = Math.abs(t2 - t1)/PPS;
    var bpbt = (i/dt) * BLOCK_TIME; // Blocks per Block Time
    BPS = (i / dt);

    if (i < 3*144 || true) {
        var w1 = (W/i);
        var w2 = 0;

        var f = (bpbt*(-1 >>> 0) + w1)/(bpbt+1);
        if (bpbt < 1) {
            bpbt = 1/bpbt;
            f = (bpbt*(-1 >>> 0) + w1)/(bpbt+1);
            f = w1 - (f - w1);
        }

        w2 = Math.floor(Math.max(Math.min(f, (-1 >>> 0)), 1));
        return w2;
    }
    return blocks.diff;
}

function mine_block(pool) {
    var found = false;
    var blocks = get_blockchain(pool);

    var diff = blocks.diff;
    var next_hash = 0;
    var next_salt = "";
    var hpp = POOLS[pool].HPP + POOLS[pool].bonus;

    if (POOLS[pool].HPP > 0) {
        for (; hpp>0; --hpp) {
            next_salt = Math.random().toString(36).substring(2);
            next_hash = hashCode(blocks.hash+(BLOCK_ID+next_salt));
            var max_hash = ( (-1 >>> 0) - diff);
            if (next_hash <= max_hash) {
                found = true;
                break;
            }
        }
    }
    POOLS[pool].bonus = hpp;

    if (found) {
        var block = create_block();
        block.pool = pool;
        block.salt = next_salt;
        block.hash = next_hash;
        block.diff = calc_diff(blocks);

        block.height = POOLS[pool].blocks.height + 1;
        block.next = POOLS[pool].blocks;
        POOLS[pool].blocks = block;
        return true;
    }
    return false;
}

////////////////////////////////////////////////////////////////////////////////
// ENGINE FUNCTIONS ARE BELOW                                                 //
////////////////////////////////////////////////////////////////////////////////
var SHOWING_PROMPT = false;
function app_start() {
    if (window.attachEvent) {
        window.attachEvent('onload', app_main);
    } else {
        if (window.onload) {
            var curronload = window.onload;
            var newonload = function() {
                curronload();
                app_main();
            };
            window.onload = newonload;
        } else {
            window.onload = app_main;
        }
    }
}

function app_main() {
    var app_main = document.getElementById("app-main");
    app_main.classList.add("app-disappear");

    setTimeout(function(){
        app_main.classList.remove("app-disappear");
        app_main.classList.add("app-appear");
        while (app_main.hasChildNodes()) {
            app_main.removeChild(app_main.lastChild);
        }

        app_main.appendChild(app_create_terminal());

        window.addEventListener("message", function(event) {
            if (typeof event.data === 'string' || event.data instanceof String) {
                if (SHOWING_PROMPT) {
                    app_receive_output("\n\r");
                    SHOWING_PROMPT = false;
                }
                app_receive_output(event.data);
            }
            else if ("payload" in event.data && "type" in event.data) {
                if (event.data.type === "prompt") SHOWING_PROMPT = true;
                app_receive_output(event.data.payload);
            }
        });

        if (window.location != window.parent.location) window.parent.postMessage("TEXT", "*");

        BLOCKS = create_block();
        BLOCKS.salt = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks";
        BLOCKS.hash = hashCode(BLOCKS.salt);
        BLOCKS.diff = 1;

        app_main_loop();
    }, 500);
}

function app_main_loop() {
    setTimeout(function(){
        app_main_loop();
    }, 1000/PPS);

    ++PULSE;

    var mobile = false;
    var hashes = location.hash.substring(1).split("#");
    for (var i=0, sz=hashes.length; i<sz; ++i) {
        var hash = decodeURIComponent(hashes[i]);
        if (hash === "mobile") mobile = true;
    }

    var input = document.getElementById("app-input-wrapper");
    if (mobile) input.style.display = "none";
    else        input.style.display = "";

    var output = document.getElementById("app-output");
         if ( mobile && !output.classList.contains("mobile")) output.classList.add   ("mobile");
    else if (!mobile &&  output.classList.contains("mobile")) output.classList.remove("mobile");

    var pools = [];
    var block_found = false;

    for (var key in POOLS) {
        if (POOLS.hasOwnProperty(key)) {
            pools.push(key);
        }
    }

    shuffle(pools);

    var old_diff = 0;

    for (var i=0; i<pools.length; ++i) {
        get_blockchain(pools[i]);
        old_diff = POOLS[pools[i]].blocks.diff;

        if (!block_found && mine_block(pools[i])) {
            set_blockchain(pools[i]);
            var new_diff = POOLS[pools[i]].blocks.diff;

            if (BLOCKS.id === POOLS[pools[i]].blocks.id) {
                var ddiff = new_diff - old_diff;
                if (ddiff > 0) ddiff = "+"+ddiff;
                app_receive_output(POOLS[pools[i]].ansi+" found block "+(BLOCKS.next ? ((BLOCKS.next.id)+"->") : "")+BLOCKS.id+" at "+Math.ceil(BLOCKS.time/PPS)+"s ("+dec2bin(BLOCKS.hash).padStart(32, "0")+" / "+dec2bin(BLOCKS.diff).padStart(32, "0")+" / "+ddiff+", "+Math.round(BPS)+" BPS).\x1b[0m\n");
            }
            else {
                var ddiff = new_diff - old_diff;
                if (ddiff > 0) ddiff = "+"+ddiff;
                var blocks = POOLS[pools[i]].blocks;
                app_receive_output(POOLS[pools[i]].ansi+" \x1b[1;35mhides block "+(blocks.next ? ((blocks.next.id)+"->") : "")+blocks.id+" at "+Math.ceil(blocks.time/PPS)+"s ("+dec2bin(blocks.hash).padStart(32, "0")+" / "+dec2bin(blocks.diff).padStart(32, "0")+" / "+ddiff+", "+Math.round(BPS)+" BPS)!\x1b[0m\n");
                if ("score" in POOLS[pools[i]]) POOLS[pools[i]].score++;
            }
            block_found = true;
        }
        else if (block_found) {
            POOLS[pools[i]].bonus += POOLS[pools[i]].HPP;
        }
    }

    for (var i=0; i<pools.length; ++i) get_blockchain(pools[i]);


    // Let's calculate the pool share sizes...
    {
        var block = BLOCKS;
        var i  = 0;
        var shares = {};
        for (i=0; i<14400; ++i) {
            if (block === null) break;

            if (block.pool in shares) shares[block.pool]++;
            else                      shares[block.pool] = 1;

            block = block.next;
        }

        for (var key in shares) {
            if (shares.hasOwnProperty(key) && i > 0 && key in POOLS) {
                //shares[key] = Math.round(100*(shares[key]/i));
                POOLS[key].share = Math.round(100*(shares[key]/i));
            }
        }
    }
}

function app_create_terminal() {
    var terminal = document.createElement("div");
    terminal.id = "app-terminal";

    var output_wrapper = document.createElement("div");
    output_wrapper.id = "app-output-wrapper";

    var output_wrapper_buf = document.createElement("div");
    output_wrapper_buf.id = "app-output-wrapper-scrollbox";
    output_wrapper.appendChild(output_wrapper_buf);

    var output_body = document.createElement("div");
    output_body.id = "app-abs-output";
    output_wrapper_buf.appendChild(output_body);

    var output_container = document.createElement("div");
    output_container.id = "app-output-container";
    output_body.appendChild(output_container);

    var output = document.createElement("div");
    output.id = "app-output";
    output_container.appendChild(output);

    var input_wrapper = document.createElement("div");
    input_wrapper.id = "app-input-wrapper";

    var input_padding = document.createElement("div");
    input_padding.id = "app-input-padding";

    input_wrapper.appendChild(input_padding);

    var input = document.createElement("input");
    input.id = "app-input";
    input.type = "text";
    input.placeholder = "Enter your command here.";
    input.onkeydown = function(e) {
        if (e.keyCode == 13) app_send_input();
    };

    input.classList.add("app-borderbox");
    input_padding.appendChild(input);

    terminal.appendChild(output_wrapper);
    terminal.appendChild(input_wrapper);

    return terminal;
}

function app_send_input() {
    var input = document.getElementById("app-input");
    var command = input.value;

    //app_receive_output(command+"\n");
    SHOWING_PROMPT = false;
    if (window.location != window.parent.location) window.parent.postMessage("TEXT:"+command, "*");
    else app_receive_output(command+"\n");

    if (command.length > 0) input.select();

    var container = document.getElementById("app-output-container");
    if (container) container.scrollTop = container.scrollHeight;
}

function app_receive_output(raw_text) {
    var text = raw_text.replace(/\r/g, "");

    var container = document.getElementById("app-output-wrapper-scrollbox");
    var scroll    = true;

    if (container.scrollTop + 1 < container.scrollHeight - container.offsetHeight) {
        scroll = false;//!document.hasFocus();
    }

    var output  = document.getElementById("app-output");

    var elements = app_ansi2html(text);
    for (var i = 0; i < elements.length; i++) {
        output.appendChild(elements[i]);
    }

    if (scroll) {
        container.scrollTop  = container.scrollHeight;
        container.scrollLeft = 0;
    }

    if (output.innerHTML.length > 655360)
    while (output.innerHTML.length > 491520) {
        if (output.hasChildNodes()) {
            output.removeChild(output.firstChild);
        }
    }
}

// Processes ANSI escape codes and adds css styling for colors.
// While this ignores most codes, some might be improperly parsed!
// Returns an array of elements to add
function app_ansi2html(bytes) {
    function changeState(state, numbers) {
        var resetState = {foreground: null, background: null, attributes: []};
        var newState = (numbers.length === 0 ? resetState : state);
        if (newState.attributes == null) newState.attributes = [];

        var num = 0;
        for (var i = 0; i < numbers.length; i++) {
            num = numbers[i];
            if (num === 0) {
                newState = {foreground: null, background: null, attributes: []};
            } else if (num < 10) {
                if (!newState.attributes.includes(num)) {
                    newState.attributes.push(num);
                }
            } else if (num === 22) {
                var remaining = [];
                for (var j = 0; j < newState.attributes.length; j++) {
                    if (newState.attributes[j] === 1) continue;
                    remaining.push(newState.attributes[j]);
                }
                newState.attributes = remaining;
            } else if (num >= 30 && num < 38) {
                newState.foreground = num % 10;
            } else if (num === 39) {
                newState.foreground = null;
            } else if (num >= 40 && num < 48) {
                newState.background = num % 10;
            } else if (num === 49) {
                newState.background = null;
            }
        }

        return newState;
    }

    function createSpan(state) { // make empty span element with proper styling
        var output = document.createElement("span");

        if (state.foreground !== null) output.classList.add("ansi-fg-" + state.foreground);
        if (state.background !== null) output.classList.add("ansi-bg-" + state.background);

        for (var i = 0; i < state.attributes.length; i++) {
            output.classList.add("ansi-format-" + state.attributes[i]);
        }

        return output;
    }

    var lastEscape = null; // position of last escape character
    var inEscapeCode = false;
    var state = {
        foreground: null,
        background: null,
        attributes: [] // things like bold or strikethrough
    };

    var output = []; // future array of all elements
    var currentElement = createSpan(state);
    var currentText = ""

    var currentNumber = "";
    var parsedNumbers = [];

    for (var k = 0; k < bytes.length; k++) {
        var c = bytes[k];
        if (inEscapeCode) {
            if (k - lastEscape === 1 && c != "[") { // return if it doesn't start with ESC-[
                inEscapeCode = false;
                continue;
            }

            if (isNumeric(c)) { // parse number
                currentNumber += c;
            } else if (c == ";") {
                if (currentNumber.length > 0) {
                    parsedNumbers.push(parseInt(currentNumber));
                }
                currentNumber = "";
            } else if (c == "m") {
                if (currentNumber.length > 0) {
                    parsedNumbers.push(parseInt(currentNumber));
                }
                state = changeState(state, parsedNumbers);

                currentElement.appendChild(document.createTextNode(currentText));
                output.push(currentElement);

                currentElement = createSpan(state);
                currentText = "";

                inEscapeCode = false;
                lastEscape = null;
            }
        } else {
            if (c === "\x1b" && lastEscape === null) {
                // start escape code
                lastEscape = k;
                inEscapeCode = true;
                currentNumber = "";
                parsedNumbers = [];
                continue;
            } else {
                currentText += c;
            }
        }
    }

    if (currentText.length > 0) {
        currentElement.appendChild(document.createTextNode(currentText));
        output.push(currentElement);
    }
    return output;
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function dec2bin(dec){
    return ((dec >>> 0).toString(2));
}

function nearestPow2(n) {
  var m = n;
  for(var i = 0; m > 1; i++) {
    m = m >>> 1;
  }
  // Round to nearest power
  if (n & 1 << i-1) { i++; }
  return 1 << i;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function hashCode(str) {

    var hash = 0;
    if (str.length == 0) {
        return hash;
    }
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+c;
        hash = hash & hash; // Convert to 32bit integer
    }
    return (hash >>> 0);
}

