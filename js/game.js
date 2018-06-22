import * as Util from './util';
import Particle from './particle';
import Player from './player';
import Wheel from './wheel';
import Bullet from './bullet';
import { fetchJob } from './index';
import { jobs } from './main';
import Fractal from './fractal';

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

class Game {
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.wheel = [];
        this.bullets = [];
        this.player = [];
        this.won = false;
        this.addWheels(10);
    }

    add(object){
        if(object instanceof(Wheel)){
            this.wheel.push(object);
        }else if (object instanceof(Player)){
            this.player.push(object);
        }else{
            this.bullets.push(object);
        }
    }

    addWheels(num){
        for(let i = 0; i < num; i++){
            const center = {
                x: Util.randomIntfromRange(0, this.canvas.width - 185),
                y: Util.randomIntfromRange(0, this.canvas.height - 185)
            }
    
            this.add(new Wheel(center.x, center.y, colors, this.canvas));
        }
    }

    onBulletCollision(c){
        let deleteWheelIdx;
        let deleteBulletIdx;

        this.wheel.forEach( (wheel, i) => {
            const wheelObj = {
                x: wheel.x + wheel.velocity_x,
                y: wheel.y + wheel.velocity_y,
                radius: 110
            }
            this.bullets.forEach( (bullet, j) => {
                const bulletObj = {
                    x: bullet.x,
                    y: bullet.y,
                    radius: Bullet.RADIUS
                }

                if(Util.checkCollision(wheelObj, bulletObj)){
                    wheel.explode(c)
                    deleteWheelIdx = i;
                    deleteBulletIdx = j;
                }
            })
        });

        if(deleteWheelIdx !== undefined){
            // debugger;
            this.wheel.splice(deleteWheelIdx, 1);
            this.bullets.splice(deleteBulletIdx, 1);
        }
        this.callJob();
    }

    addPlayer(){
        const player = new Player(this.canvas, this);
        this.add(player);
        return player;
    }

    callJob(){
        if(this.wheel.length === 0){
            // return fetchJob().then(response => {
            //     const jobs = response.data;
            //     const randJob = jobs[Util.randomIntfromRange(0,jobs.length-1)];
            //     window.location.href = randJob.url;
            // });
            this.won = true;
            let endModal = document.querySelector('.end-modal');
            this.fillDivWithJobInfo();
            // debugger;
            setTimeout(() => {
                endModal.style.display = 'flex';
            }, 100);
        }
    }

    fillDivWithJobInfo(){
        // console.log(jobs);
        const job = jobs[Util.randomIntfromRange(0, jobs.length-1)];
        // console.log(job)
        let jobTitle = document.getElementById('job-title');
        // let jobType = document.getElementById('job-type');
        let jobCompany = document.getElementById('job-company');
        let jobLocation = document.getElementById('job-location');
        let jobURL = document.getElementById('job-url');

        jobTitle.innerText =  job.title;
        // jobType.innerText= job.Type;
        jobLocation.innerText= job.location
        jobCompany.innerText= job.company;
        jobURL.href = job.url;
    }

    draw(c){
        this.wheel.forEach(wheel => wheel.update(c));
        this.player[0].update(c);
        this.bullets.forEach(bullet => bullet.update(c));
    }
}

export default Game;

