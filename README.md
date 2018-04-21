# ShellFish
ShellFish is a Selfish Mining simulator that uses the Monte Carlo method to test
the viability of Selfish Mining. It is written in JavaScript and its main goal
is to reveal once and for all whether Selfish Mining poses any practical threats
to the security of Bitcoin (Bitcoin Cash).

While abstract mathematics may be useful for exploring theoretical implications
of even more theoretical conditions, a down-to-earth experiment is necessary to
bring some clarity into view. The main feature of this software is to simulate
the aspect of luck in the mining process as well as possible. For that reason,
ShellFish includes a difficulty adjustment algorithm in its implementation and
the virtual miners actually try to solve the mining puzzle to find new blocks.

In its current configuration, the selfish mining pool (named ShellFishPool) owns
47% of the global hashing power. If the simulator runs for until 15000 blocks
get mined, it becomes obvious that the selfish mining pool has gained ownership
over 50% of blocks. These results are consistent regardless of hown many times
the simulation is executed. In fact, it is the nature of the Monte Carlo method
to produce progressively more precise results as the simulation keeps running.

On the other hand, if the selfish mining pool controls only 45% of the global
hashing power, then their block ownership in the final block chain is also 45%,
as expected by the security model of Bitcoin. According to this simulator, any
hashing power less than 45% results in even lesser ownership over the resulting
block chain. This means that Selfish Mining with the hashing power lesser than
45% is in fact helping the honest miners and is thus counterproductive for the
selfish miner.

Since any single entity controlling more than 40% of the global hashing power is
already a huge threat for the whole network even without Selfish Mining, it is
clear that Selfish Mining is a non-issue. At the point where a single entity has
accumulated such a large proportion of mining power, the Bitcoin network already
has bigger fish to fry than the potential threat of Selfish Mining.


# Author's Tip Jar
```
Base58:   1Erich1YUdkUAp9ynf4Rfw2ug8nBtuUmMu
CashAddr: QZVQPSVVET3CPPU9Y0PE8L4ALPHQJCS09URP9RUJDH
```

# Sample Output
Quick demo here: https://jsfiddle.net/ksfx0dou/

```
ShellFishPool hides block 15379->15380 at 663s (00000011001001000110010011101100 / 11111100110100111110010000101010 / -244530, 15 BPS)!
ShellFishPool hides block 15380->15381 at 663s (00000000101001011011100110000010 / 11111100110100000001011100111011 / -249071, 15 BPS)!
ShellFishPool hides block 15381->15382 at 663s (00000001111110000010010101010101 / 11111100110011001010100001101010 / -224977, 16 BPS)!
ShellFishPool hides block 15382->15383 at 664s (00000010011111111101000111110011 / 11111100110010001011111110010011 / -256215, 16 BPS)!
ShellFishPool hides block 15383->15384 at 664s (00000001000011111110001000101111 / 11111100110001001100011001110010 / -260385, 16 BPS)!
HonestMinings found block 15379->15385 at 664s (00000010011111101110010011010110 / 11111100110100011010011100100011 / -391225, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15384->15386 at 664s (00000001101000010100010101110011 / 11111100110000001100001111010101 / -262813, 16 BPS)!
HonestMinings found block 15381->15387 at 664s (00000000001101110011001001011110 / 11111100110010100110001111111100 / -373567, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15386->15388 at 664s (00000010100010100111111011101100 / 11111100101111001011001011101101 / -266472, 16 BPS)!
ShellFishPool hides block 15388->15389 at 664s (00000000111110111101001000111110 / 11111100101110001111101010111101 / -243760, 16 BPS)!
ShellFishPool hides block 15389->15390 at 664s (00000000000001100001011101110101 / 11111100101101010011010111001100 / -247025, 16 BPS)!
ShellFishPool hides block 15390->15391 at 664s (00000001111011101110011000100110 / 11111100101100001110110000100001 / -281003, 16 BPS)!
HonestMinings found block 15383->15392 at 664s (00000001111100011100110100011000 / 11111100110000010010000110010010 / -499201, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15391->15393 at 664s (00000011001110001111101011101010 / 11111100101011000001011111111110 / -316451, 16 BPS)!
ShellFishPool hides block 15393->15394 at 664s (00000011001111011100001110001001 / 11111100101001111010011101000001 / -291005, 16 BPS)!
ShellFishPool hides block 15394->15395 at 664s (00000000101011111010010010010010 / 11111100101000110010010111101000 / -295257, 16 BPS)!
HonestMinings found block 15386->15396 at 664s (00000000101000001101001101101010 / 11111100101110010000010011110010 / -507619, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
HonestMinings found block 15389->15397 at 664s (00000001001001110000111111000001 / 11111100101100011110111000100011 / -461978, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15395->15398 at 664s (00000010000111111111010100111011 / 11111100100111011001110100001101 / -362715, 15 BPS)!
ShellFishPool hides block 15398->15399 at 664s (00000000110101011111101001110111 / 11111100100110011110000101011110 / -244655, 16 BPS)!
ShellFishPool hides block 15399->15400 at 664s (00000001101110100000101101101110 / 11111100100101010001111101110010 / -311788, 16 BPS)!
ShellFishPool hides block 15400->15401 at 664s (00000010111100000011100110011110 / 11111100100100000100010001100111 / -318219, 16 BPS)!
ShellFishPool hides block 15401->15402 at 664s (00000010010111011111100011010010 / 11111100100010111011011111111010 / -298093, 16 BPS)!
ShellFishPool hides block 15402->15403 at 664s (00000010001101000011001000001110 / 11111100100001101001111010110010 / -334152, 16 BPS)!
ShellFishPool hides block 15403->15404 at 664s (00000000101011000000101110100011 / 11111100100000010111001011001001 / -338921, 16 BPS)!
HonestMinings found block 15391->15405 at 664s (00000010011100011100010110110100 / 11111100101001100111101011101101 / -684340, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
HonestMinings found block 15394->15406 at 664s (00000011010010100000110001010100 / 11111100100111011111000010000111 / -636602, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15404->15407 at 664s (00000001001100110101110010110011 / 11111100011110111011001010011001 / -376880, 16 BPS)!
HonestMinings found block 15398->15408 at 664s (00000001011011101110100111100100 / 11111100100101011000111011110101 / -527896, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15407->15409 at 664s (00000000110101010100101110110110 / 11111100011101011101111101100110 / -381747, 16 BPS)!
ShellFishPool hides block 15409->15410 at 664s (00000001001011100110011000000101 / 11111100011100000111100001010001 / -354069, 16 BPS)!
HonestMinings found block 15400->15411 at 664s (00000000000000100011110100011001 / 11111100100010110110101110010001 / -635873, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15410->15412 at 664s (00000001000111110001010011111100 / 11111100011010101111001100100101 / -361772, 16 BPS)!
ShellFishPool hides block 15412->15413 at 664s (00000000011101011010101000011100 / 11111100011001010110001000011111 / -364806, 16 BPS)!
ShellFishPool hides block 15413->15414 at 664s (00000001010101111101010111011110 / 11111100010111111011101010110111 / -370536, 16 BPS)!
ShellFishPool hides block 15414->15415 at 665s (00000001110011100010110000010110 / 11111100010110011111000111011011 / -379100, 16 BPS)!
ShellFishPool hides block 15415->15416 at 665s (00000001100000000100010000011101 / 11111100010101000000011010011011 / -387904, 16 BPS)!
HonestMinings found block 15402->15417 at 665s (00000001100111011001111110010101 / 11111100011111111100011101010010 / -782504, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15416->15418 at 665s (00000001011000111000010110000101 / 11111100010011100000011001101011 / -393264, 16 BPS)!
HonestMinings found block 15404->15419 at 665s (00000000100001110000100100001000 / 11111100011101011100001111100101 / -765668, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
HonestMinings found block 15409->15420 at 665s (00000010100111010011000101100001 / 11111100011010110111011110110100 / -681906, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
HonestMinings found block 15412->15421 at 665s (00000001111100000000110000101111 / 11111100011000010101000110101100 / -631161, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
HonestMinings found block 15414->15422 at 665s (00000000001101011110100001100000 / 11111100010101100101011010011111 / -615448, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
ShellFishPool hides block 15418->15423 at 665s (00000010000010010111100110111101 / 11111100010001011101011101010100 / -536343, 15 BPS)!
HonestMinings found block 15416->15424 at 665s (00000001111111010001011100011101 / 11111100010010101110001110011111 / -598780, 15 BPS).
ShellFishPool reveals 2 hidden blocks and has mined 50% of blocks with 47% of hashing power.
```

