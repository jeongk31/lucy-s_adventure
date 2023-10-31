/* notes 
- refer to day12 for perlin system with mouse - use as soap and water (cleaning) for lucy
- need to let Lucy move till each end of canvas
- have attribute bar spread across canvas (despite size of screen)
- have attributes with visible bar (instead of just numbers)
- make options to 'start new game' or 'continue playing'
*/

let w = 500;
let h = 253;
let bg_x = -350;

// 0 pregame | 1 house | 2 cleaning | 3 feeding | 4 gallery-1 | 5 gallery-2 | 6 game
// game-1 will be in separate js files
let state = 1;
let most_recent_state = 1;

let img_speed = 0;
let Lucy_initx = 130;
let Lucy_inity = 50;
let lucy_xspeed = 0;
let lucy_yspeed = 0;
let lucy_onground = true;
let lock = true;

let leftPressed = false;
let rightPressed = false;

let radiomute = false;

let lvup = false;

let cleanness_value, nutrition_value;

let background, bathroom, Lucy_img, refrigerator, gallery_1, gallery_2, soap, bubble;
let angry, bubblesound, eating, error, opengallery, happy1, happy2, happy3, hungry, jump, levelup, money_spend, opendoor, shower, backgroundmusic;

let hungrysoundplayed = false;
let bubblesoundplaying = false;
let showerplaying = false;
let levelupplayed = false;

let soap_x = 270;
let soap_y = 114;
let holding_soap = false;
let wateron = false;

let bubbles = [];
let waterfall = [];

let levelup_text_transparency = 0;

let tax = 1.1;


function preload() {
    background = loadImage("images/background.png");
    bathroom = loadImage("images/bathroom.png");
    Lucy_img = loadImage("images/Lucy.png");
    refrigerator = loadImage("images/refrigerator.png");
    gallery_1 = loadImage("images/gallery-1.jpeg");
    gallery_2 = loadImage("images/gallery-2.jpeg");
    soap = loadImage("images/soap.png");
    bubble = loadImage("images/bubble.png");

    angry = loadSound("sounds/angry.mp3");
    bubblesound = loadSound("sounds/bubble.mp3");
    eating = loadSound("sounds/eating.mp3");
    error = loadSound("sounds/error.mp3");
    opengallery = loadSound("sounds/gallery.mp3");
    happy1 = loadSound("sounds/happy1.mp3");
    happy2 = loadSound("sounds/happy2.mp3");
    happy3 = loadSound("sounds/happy3.mp3");
    hungry = loadSound("sounds/hungry.mp3");
    jump = loadSound("sounds/jump.mp3");
    levelup = loadSound("sounds/levelup.mp3");
    money_spend = loadSound("sounds/money.mp3");
    opendoor = loadSound("sounds/opendoor.mp3");
    shower = loadSound("sounds/shower.mp3");
    backgroundmusic = loadSound("sounds/backgroundmusic.mp3");
}

function setup() {
    let cnv = createCanvas(w, h);

    cnv.parent('#canvas_container');
    cnv.style('border', '1px solid black');
    cnv.style('display', 'block');
    cnv.style('margin', 'auto');

    lucy = new Lucy(Lucy_initx, Lucy_inity);
}

function draw() {
    imageMode(CORNER);

    cleanness_value = random(0.01, 0.025);
    nutrition_value = random(0.01, 0.025);

    if(state == 1) {
        document.getElementById('mute_button').style.display = 'flex';
    }
    else {
        document.getElementById('mute_button').style.display = 'none';
    }

    if(state == 1) {
        if(!radiomute) {
            playBackgroundMusic();
        } else {
            backgroundmusic.stop();
        }

        most_recent_state = 1;
        resizeCanvas(w, h);
        image(background, bg_x, -413);

        lucy.display();

        bg_x -= img_speed;
        
        if(leftPressed) {
            leftMovement();
        }

        if(rightPressed) {
            rightMovement();
        }

        bg_x = constrain(bg_x, -575, 0);

        shower.stop();      // in case it doens't stop

        document.getElementById('leave_bathroom_button').style.display = 'none';
        document.getElementById('close_refrigerator_button').style.display = 'none';
        document.getElementById('orange_button').style.display = 'none';
        document.getElementById('apple_button').style.display = 'none';
        document.getElementById('chocolate_button').style.display = 'none';
        document.getElementById('chicken_button').style.display = 'none';
        document.getElementById('bacon_button').style.display = 'none';
        document.getElementById('beef_button').style.display = 'none';
        document.getElementById('lobster_button').style.display = 'none';
        document.getElementById('leave_gallery_button').style.display = 'none';

        if(bg_x < -30 && bg_x > -160) {
            document.getElementById('bathroom_button').style.display = 'flex';
        } else {
            document.getElementById('bathroom_button').style.display = 'none';
        }

        if(bg_x === -575 && lucy.xPos >= 155 && lucy.xPos <= 280) {
            document.getElementById('open_refrigerator_button').style.display = 'flex';
        } else {
            document.getElementById('open_refrigerator_button').style.display = 'none';
        }

        if(bg_x < -220 && bg_x > -285) {
            document.getElementById('gallery_1_button').style.display = 'flex';
        } else {
            document.getElementById('gallery_1_button').style.display = 'none';
        }

        if(bg_x < -495 && bg_x > -575) {
            document.getElementById('gallery_2_button').style.display = 'flex';
        } else {
            document.getElementById('gallery_2_button').style.display = 'none';
        }

        let happytmp = random(1, 4);
        if(lucy.health >= 80 && lucy.cleanness >= 80 && lucy.nutrition >= 80) {
            if(frameCount % 350 == 0) {
                if(happytmp < 2) {
                    happy1.play();
                }
                else if(happytmp < 3) {
                    happy2.play();
                }
                else {
                    happy3.play();
                }
            }
        }

        if(bg_x === 0 && lucy.xPos > -70 && lucy.xPos < 15) {
            text("game_button" , 120, 10, 10, 20);
        }
    }

    if(state == 2) {
        most_recent_state = 2
        backgroundmusic.stop();

        document.getElementById('bathroom_button').style.display = 'none';
        resizeCanvas(400, 253);

        image(bathroom, 0, 0, 400, 294);

        push();
        textSize(10);
        fill(0);
        text("$15", 261.5, 100);
        pop();

        lucy.direction = 1;
        lucy.xPos = 80;
        lucy.yPos = 60;

        lucy.display();

        noStroke();
        if ((Math.pow(mouseX/2 - 133, 2) / Math.pow(15, 2)) + (Math.pow(mouseY/2 - 90, 2) / Math.pow(7.5, 2)) <= 1) {
            fill(68, 80, 255);
            if(mouseIsPressed) {
                waterfall.push(new Waterfall());
                wateron = true;

                if(!showerplaying) {
                    shower.play();
                    showerplaying = true;
                }
            }
            else {
                wateron = false;
                if(showerplaying) {
                    shower.stop();
                    showerplaying = false;
                }
            }
        }
        else {
            fill(222, 94, 94);
            wateron = false;
        }

        ellipse(133, 90, 30, 15);

        fill(255);
        textSize(6);
        text("WATER", 122.5, 92);

        push();
        imageMode(CENTER);
        image(soap, soap_x, soap_y, 40, 40);
        pop();

        if(holding_soap) {
            soap_x = mouseX/2;
            soap_y = mouseY/2;
        }
        else {
            soap_x = 270;
            soap_y = 116;
        }


        if(holding_soap && mouseX/4 > lucy.xPos && mouseX/4 < lucy.xPos + 30 && mouseY/4 > lucy.yPos && mouseY/4 < lucy.yPos + 35) {
            if(frameCount % 5 == 0) {
                bubbles.push(new Bubble());
            }
            
            if(!bubblesoundplaying) {
                bubblesound.play();
                bubblesound.setVolume(2);
                bubblesoundplaying = true;
            }
        }
        else {
            if(bubblesoundplaying) {
                bubblesound.stop();
                bubblesoundplaying = false;
            }
        }

        bubbles.length = constrain(bubbles.length, 0, 50);

        for (let i = bubbles.length - 1; i >= 0; i--) {
            bubbles[i].update();
            bubbles[i].display();

            if (bubbles[i].outofbounds() || bubbles[i].transparency <= 0) {
                bubbles.splice(i, 1);
            }
        }

        for (let i = 0; i < waterfall.length; i++) {
            waterfall[i].update();
            waterfall[i].display();

            if(waterfall[i].yPos > 222) {
                waterfall.splice(i, 1);
            }
        }

        document.getElementById('leave_bathroom_button').style.display = 'flex';
    }

    if(state == 3) {
        most_recent_state = 3;
        backgroundmusic.stop();

        document.getElementById('open_refrigerator_button').style.display = 'none';

        document.getElementById('orange_button').style.display = 'flex';
        document.getElementById('apple_button').style.display = 'flex';
        document.getElementById('chocolate_button').style.display = 'flex';
        document.getElementById('chicken_button').style.display = 'flex';
        document.getElementById('bacon_button').style.display = 'flex';
        document.getElementById('beef_button').style.display = 'flex';
        document.getElementById('lobster_button').style.display = 'flex';

        
        image(refrigerator, 0, -12, 500, 420)
        document.getElementById('close_refrigerator_button').style.display = 'flex';

        push();
        fill(255);
        textSize(26);
        text("Menu", 53, 37);
        pop();

        push();
        textSize(12);
        fill(185,235,245);
        text("  Orange                   $10", 10, 68);
        text("  Apple                      $20", 10, 85);
        fill(224, 224, 224);
        text("  Chocolate               $30", 10, 107);
        text("  Chicken                  $50", 10, 124);
        text("  Bacon                     $60", 10, 141);
        fill(249, 232, 176);
        text("  Beef                        $80", 10, 163);
        text("  Lobster                   $110", 10, 180);
        
        fill(209, 243, 230);
        textSize(7);
        text("Prices are subjected to 10% tax as per LCW rates", 7, 204);
        pop();


    }

    if(state == 4 || state == 5) {
        most_recent_state = 4;
        resizeCanvas(gallery_1.width*0.175, h);
        document.getElementById('leave_gallery_button').style.display = 'flex';

        if(state == 4) {
            document.getElementById('gallery_1_button').style.display = 'none';
            image(gallery_1, 0, 0, gallery_1.width*0.175, gallery_1.height*0.175);
        }
        else if(state == 5) {
            document.getElementById('gallery_2_button').style.display = 'none';
            image(gallery_2, 0, 0, gallery_2.width*0.35, gallery_2.height*0.35);
        }

        fill(255);
        textSize(6);
        text("Photo taken by: Jeong Kyu Lee", 288, 240)
    }

    // COORDINATES
    // text("bg_x: " , 120, 10, 10, 20);
    // text(bg_x, 155, 10, 10, 20);
    // text("lucyx: " , 220, 10, 10, 20);
    // text(lucy.xPos, 255, 10, 10, 20);
    // text(lucy.money, 295, 0, 10, 20);

    lucy.update();

    if(lucy.cleanness <= 0) {
        lucy.health -= cleanness_value;
        if(frameCount % 250 == 0) {
            angry.play();
        }
    }
    else {
        lucy.cleanness -= cleanness_value;
    }

    if(lucy.nutrition <= 0) {
        if(!hungrysoundplayed) {
            hungry.play();
            hungrysoundplayed = true;
        }
        lucy.health -= nutrition_value;
    }
    else {
        hungrysoundplayed = false;
        lucy.nutrition -= nutrition_value;
    }

    lucy.health = constrain(lucy.health, 0, 100);
    lucy.cleanness = constrain(lucy.cleanness, 0, 100);
    lucy.nutrition = constrain(lucy.nutrition, 0, 100);
    
    if(lvup === true) {
        lucy.level += 1;
        lucy.money += map(lucy.level, 1, 5, 40, 200);
        levelup_text_transparency = 255;
        levelup.play();
        lvup = false;
    }

    lucy.level = constrain(lucy.level, 1, 5);

    push();
    noStroke();
    fill(255, 223, 0, levelup_text_transparency);
    ellipse(width/2, height/2 - 15, 300, 150);

    fill(0, levelup_text_transparency);
    textSize(50);
    textAlign(CENTER);
    text("LEVEL UP!", width/2, height/2 + 3.5);
    pop();

    if(levelup_text_transparency > 155) {
        levelup_text_transparency -= 1;
    }
    else if(levelup_text_transparency > 0) {
        levelup_text_transparency -= 4;
    }
}


function playBackgroundMusic() {
    if(!backgroundmusic.isPlaying()) {
        backgroundmusic.play();
        backgroundmusic.onended(playBackgroundMusic);
        backgroundmusic.setVolume(0.5);
    }
}

function muteRadio() {
    if(!radiomute) {
        radiomute = true;
    }
    else {
        radiomute = false;
    }
}

function leftMovement() {
    if(bg_x >= 0 && lucy.xPos <= 130) {
        bg_x = 0;
        lucy_xspeed = -5;
        lucy.direction = -1;
    } else if(bg_x === -575 && lucy.xPos >= 130) {
        lucy.xPos = constrain(lucy.xPos, 130, 320);
        lucy_xspeed = -5;
        lucy.direction = -1;
    } else {
        lucy.xPos = 130;
        img_speed = -5;
        lucy.direction = -1;
    }
}

function rightMovement() {
    if(bg_x <= -575 && lucy.xPos >= 130) {
        bg_x = -575;
        lucy_xspeed = 5;
        lucy.direction = 1;
    } else if(bg_x === 0 && lucy.xPos <= 130) {
        lucy.xPos = constrain(lucy.xPos, -75, 130);
        lucy_xspeed = 5;
        lucy.direction = 1;
    } else {
        lucy.xPos = 130;
        img_speed = 5;
        lucy.direction = 1;
    }
}

function changestate(state_input) {
    if(state_input == 4 || state_input == 5) {
        opengallery.play();
        opengallery.setVolume(2);
    }
    if(most_recent_state == 4 && state_input == 1) {
        opengallery.play();
        opengallery.setVolume(2);
    }

    if(state_input == 2 || state_input == 3) {
        opendoor.play();
    }
    if(state_input == 1 && (most_recent_state == 2 || most_recent_state == 3)) {
        opendoor.play();
    }

    state = state_input;
}

function purchasefood(price) {
    let total_price = price * tax;
    if(lucy.money >= Math.round(total_price)) {
        money_spend.play();
        setTimeout(function() {
            eating.play();
        }, 500);

        lucy.money = Math.round(lucy.money - total_price);
        let tmp = map(total_price, 11, 121, 2, 40); //amount of xp/nutrition gain
        lucy.xp += random(tmp - 2, tmp + 2);

        if(lucy.xp >= 100) {
            lvup = true;
            lucy.xp -= 100;
        }

        lucy.nutrition += random(tmp - 3, tmp + 3);

        if(lucy.nutrition >= 100) {
            lucy.nutrition = 100;
        }

        if(lucy.health < 100) {
            lucy.health += random(tmp - 3, tmp + 3);
            if(lucy.health >= 100) {
                lucy.health = 100;
            }
        }
    }
    else {
        error.play();
    }
}


class Lucy {
    constructor(x, y) {
        this.xPos = x;
        this.yPos = y;
        this.direction = -1
        this.money = 100;
        this.health = 100;
        this.cleanness = 100;
        this.nutrition = 100;
        this.xp = 90;
        this.level = 1;
    }
    display() {
        push();
        if (this.direction === 1) {
            translate(this.xPos, this.yPos);
        } else {
            translate(this.xPos + h, this.yPos);
        }
        scale(this.direction, 1);

        if(state == 1) {
            image(Lucy_img, 0, 0, 500, 300);
        }
        if(state == 2) {
            image(Lucy_img, 5, 0, 400, 240);
        }
        pop();
    }
    update() {
        this.yPos += lucy_yspeed;
        this.xPos += lucy_xspeed;

        this.xPos = constrain(this.xPos, -75, 320);

        if(this.yPos < Lucy_inity) {
            lucy_yspeed += 1;
        }
        if(this.yPos >= Lucy_inity) {
            lucy_yspeed = 0;
            this.yPos = Lucy_inity;
            lucy_onground = true;
        }

        document.getElementById('money').innerHTML = this.money;
        document.getElementById('health_fill').style.width = `${this.health}%`;
        document.getElementById('cleanness_fill').style.width = `${this.cleanness}%`;
        document.getElementById('nutrition_fill').style.width = `${this.nutrition}%`;
        document.getElementById('xp_fill').style.width = `${this.xp}%`;
        document.getElementById('level').innerHTML = this.level;
    }
}


class Bubble {
    constructor() {
        this.xPos = random(mouseX/2 - 2, mouseX/2 + 2);
        this.yPos = random(mouseY/2 - 2, mouseY/2 + 2);
        this.size = random(8, 25);
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);
        this.transparency = 255;
        this.alpha_speed = random(0.7, 2.5);
        this.leaveonbody = random(1, 100);
        this.washedspeed = random(0.5, 2);
        this.gave_xp = false;
    }

    update() {
        if(this.leaveonbody < 50) {
            this.xPos += map(noise(this.xOff), 0, 1, -1, 1);
            this.yPos += map(noise(this.yOff), 0, 1, -2, -1);
            this.xOff += 0.01;
            this.yOff += 0.01;
            this.transparency -= this.alpha_speed;
        }
        else {
            if(wateron === true) {
                if(this.transparency < 120) {
                    this.transparency -= this.washedspeed * 3;
                }
                else {
                    this.transparency -= this.washedspeed;
                }

                if(this.transparency < 10 && this.gave_xp === false) {
                    let clean_tmp = random(2, 5)
                    if(lucy.cleanness < 100) {
                        lucy.cleanness += clean_tmp;
                        lucy.xp += clean_tmp/15;
                    }
                    if(lucy.cleanness >= 100) {
                        lucy.cleanness = 100;
                    }

                    if(lucy.xp >= 100) {
                        lvup = true;
                        lucy.xp -= 100;
                    }
                    this.gave_xp = true;
                }
            }
        }
    }

    display() {
        imageMode(CENTER);
        tint(255, this.transparency);
        image(bubble, this.xPos, this.yPos, this.size, this.size);
        noTint();
    }

    outofbounds() {
        return this.yPos + this.size < 0;
    }
}


class Waterfall {
    constructor() {
        this.xPos = random(width/2 - 30, width/2 + 18);
        this.yPos = 20;
        this.height = 12;
        this.width = random(1, 2);
        this.speed = random(3, 7);
    }

    update() {
        this.yPos += this.speed;
    }

    display() {
        fill(100, 157, 243, 150);
        noStroke();
        rectMode(CENTER);
        rect(this.xPos, this.yPos, this.width, this.height, 1);
    }
}


function keyPressed() {
    if (key === 'a' || key === 'A') {
        leftPressed = true;
    }

    if(key === 'd' || key === 'D') {
        rightPressed = true;
    }

    if(key === 'w' || key === 'W') {
        if(lucy_onground == true) {
            lucy_yspeed = -10;
            lucy_onground = false;
            jump.play();
            jump.setVolume(0.5);
        }
    }
}

function keyReleased() {
    if (key === 'a' || key === 'A') {
        img_speed = 0;
        lucy_xspeed = 0;
        leftPressed = false;
    }

    if (key === 'd' || key === 'D') {
        img_speed = 0;
        lucy_xspeed = 0;
        rightPressed = false;
    }
}

function mousePressed() {
    if(state == 2) {
        if(holding_soap) {
            holding_soap = false;
        }
        else if(mouseX/2 > soap_x - 20 && mouseX/2 < soap_x + 20 && mouseY/2 > soap_y - 20 && mouseY/2 < soap_y + 20) {
            if(lucy.money >= 15) {
                holding_soap = true;
                money_spend.play();
                lucy.money -= 15;
            }
            else{
                error.play();
            }
        }
    }
}