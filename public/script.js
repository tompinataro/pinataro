function countdownTimer(targetDate) {
    const interval = setInterval(() => {
        const now = new Date();
        const remainingTime = targetDate - now;

        if (remainingTime < 0) {
            clearInterval(interval);
            document.getElementById('countdown').innerHTML = "Time's up!";
            return;
        }
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('countdown').innerHTML = `${days}d ${hours}h ${minutes}m`;
    }, 1000);
}
const targetDate = new Date('October 19, 2024 00:09:00');
countdownTimer(targetDate);
