"use strict";

(async() => {
    
    class ScoreBoard {
        constructor(){}
        
        static getParam = (url_string) => {
            let url = new URL(url_string);
            let c = url.searchParams.get("level");
            return c
        }

        static splitTime(string) {
            return string.split(":");
        }

        static sortScores(scores) {

            let sorted = scores.sort((x, y) => {
                const [min, sec] = this.splitTime(x.time).map(Number)
                const [min2, sec2] = this.splitTime(y.time).map(Number)

                if (min === min2) {
                    return sec - sec2
                } else {
                    return min - min2
                }
            })

            return sorted
        }

        static getScoresByLevel(level) {
            let scores = JSON.parse(localStorage.getItem("scores"))

            let filtered = scores.filter(x => x.level === level);

            let sortedScores = this.sortScores(filtered);
            
            return sortedScores
        }

        static renderScores() {
            let level = this.getParam(window.location.href)
            let scores = this.getScoresByLevel(level);

            let usernames = document.querySelector(".username").querySelectorAll("li")
            let times = document.querySelector(".time").querySelectorAll("li")

            for (let i = 0; i < scores.length; i++) {
                if (i > 9) return;
                
                let curScore = scores[i];
                usernames[i+1].innerText = curScore.user
                times[i+1].innerText = curScore.time
            }
        }
    }


    if (!localStorage.getItem("scores")) return console.warn("No Scores Found!")

    let level = ScoreBoard.getParam(window.location.href);
    ScoreBoard.renderScores()

    document.querySelector("h1").innerText = "Highscores | Starter #"+ level

    document.getElementById("left").addEventListener("click", () => {
        if (level === "0") return;
        
        window.location.href = window.location.origin + window.location.pathname + "?level=" + (parseInt(level)-1).toString()
    })

    document.getElementById("right").addEventListener("click", () => {
        if (level === "8") return;
        
        window.location.href = window.location.origin + window.location.pathname + "?level=" + (parseInt(level)+1).toString()
    })
})()