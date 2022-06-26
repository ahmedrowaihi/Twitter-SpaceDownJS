#!/usr/bin/env node
import chalkAnimation from "chalk-animation";
import "dotenv/config";
import figlet from "figlet";
import gradient from "gradient-string";
import TwitterC from "./Twitter.js";

console.clear();
figlet(`Twitter-SpaceDownJS`, (err, data) => {
  console.log(gradient.mind(data));
  const AnimatedWlc = chalkAnimation.glitch("Made by @AhmedRowaihi");
  AnimatedWlc.start();
  setTimeout(() => {
    AnimatedWlc.stop();
    console.log("https://twitter.com/ahmedrowaihi");
    new TwitterC().start();
  }, 1500);
});
