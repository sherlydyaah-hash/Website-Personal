// Elemen DOM
        const bulbright = document.getElementById('bulbright');
        const lightGlow = document.getElementById('lightGlow');
        const beakerContent = document.getElementById('beakerContent');
        const startExperimentBtn = document.getElementById('startExperiment');
        const stopExperimentBtn = document.getElementById('stopExperiment');
        const lightStatus = document.getElementById('lightStatus');
        const bubbleStatus = document.getElementById('bubbleStatus');
        const lightStatusItem = document.getElementById('lightStatusItem');
        const bubbleStatusItem = document.getElementById('bubbleStatusItem');
        const electrolyteresult = document.getElementById('electrolyte-result');
        const solutiondisable = document.getElementById('solution-list');
        const solutionItems = document.querySelectorAll('.solution-item');
        const WATER_LEVEL = 80; // % dari tinggi container
        const BUBBLE_MAX_HEIGHT = WATER_LEVEL * 0.9; // 90% dari tinggi air

        // Status
        let isExperimentRunning = false;
        let currentSolution = '';
        let bubbleInterval;
        
        // Data larutan
        const solutions = {
            urea: {
                name: 'Urea',
                electrolyte: false,
                type: 'Non Elektrolit',
                color: 'rgba(14, 165, 233, 0.9)',
                bubbleIntensity: 0,
                lightIntensity: 0
            },
            amonia: {
                name: 'Amonia',
                electrolyte: true,
                weak: true,
                type: 'Elektrolit lemah',
                color: 'rgba(56, 189, 248, 0.85)',
                bubbleIntensity: 0.3,
                lightIntensity: 0.2
            },
            hcl: {
                name: 'HCl',
                electrolyte: true,
                weak: false,
                type: 'Elektrolit kuat',
                color: 'rgba(14, 165, 233, 0.95)',
                bubbleIntensity: 0.8,
                lightIntensity: 1
            },
            cuka: {
                name: 'Cuka',
                electrolyte: true,
                weak: true,
                type: 'Elektrolit lemah',
                color: 'rgba(56, 189, 248, 0.85)',
                bubbleIntensity: 0.3,
                lightIntensity: 0.2
            },
            glukosa: {
                name: 'Glukosa',
                electrolyte: false,
                type: 'Non Elektrolit',
                color: 'rgba(14, 165, 233, 0.9)',
                bubbleIntensity: 0,
                lightIntensity: 0
            },
            NaCl: {
                name: 'NaCl',
                electrolyte: true,
                weak: false,
                type: 'Elektrolit kuat',
                color: 'rgba(14, 165, 233, 0.95)',
                bubbleIntensity: 0.8,
                lightIntensity: 1
            }
        };
        
        // Fungsi untuk memilih larutan
        function selectSolution(solutionId) {
            currentSolution = solutionId;
            
            // Update tampilan larutan aktif
            solutionItems.forEach(item => {
                if (item.dataset.solution === solutionId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Update warna larutan jika eksperimen sedang berjalan
            if (isExperimentRunning) {
                updateSolutionAppearance();
            }
        }
        
        // Fungsi untuk memulai eksperimen
        function startExperiment() {
            if (isExperimentRunning) return;
            
            isExperimentRunning = true;
            const solution = solutions[currentSolution];
            
            // Nyalakan lampu jika larutan elektrolit
            if (solution.electrolyte) {
                bulbright.classList.add('on');
                lightGlow.classList.add('on');
                
                // Sesuaikan kecerahan lampu
                const glowIntensity = solution.lightIntensity;
                bulbright.style.boxShadow = `
                    0 0 ${20 * glowIntensity}px #ffeb3b,
                    0 0 ${40 * glowIntensity}px rgba(255, 235, 59, 0.7),
                    0 0 ${60 * glowIntensity}px rgba(255, 235, 59, 0.4),
                    inset 0 0 15px #fff
                `;
                
                // Update status lampu
                lightStatus.textContent = solution.weak ? 'REDUP' : 'TERANG';
                lightStatus.classList.remove('off');
                lightStatus.classList.add('on');
                lightStatusItem.classList.add('active');
            } else {
                // Matikan lampu untuk non-elektrolit
                bulbright.classList.remove('on');
                lightGlow.classList.remove('on');
                lightStatus.textContent = 'MATI';
                lightStatus.classList.remove('on');
                lightStatus.classList.add('off');
                lightStatusItem.classList.remove('active');
            }
            
            // Mulai gelembung jika larutan elektrolit
            if (solution.electrolyte && solution.bubbleIntensity > 0) {
                startBubbles(solution.bubbleIntensity);
                bubbleStatus.textContent = 'ADA';
                bubbleStatus.classList.remove('off');
                bubbleStatus.classList.add('on');
                bubbleStatusItem.classList.add('active');
            } else {
                stopBubbles();
                bubbleStatus.textContent = 'TIDAK ADA';
                bubbleStatus.classList.remove('on');
                bubbleStatus.classList.add('off');
                bubbleStatusItem.classList.remove('active');
            }
            
            updateSolutionAppearance();
            
            // Update tombol
            startExperimentBtn.disabled = true;
            startExperimentBtn.style.opacity = '0.7';
            stopExperimentBtn.disabled = false;
            stopExperimentBtn.style.opacity = '1';

            setTimeout(() => {
                electrolyteresult.classList.remove("hidden");
                electrolyteresult.textContent = solution.type;
            }, 5000);
        }
        
        // Fungsi untuk menghentikan eksperimen
        function stopExperiment() {
            if (!isExperimentRunning) return;
            
            isExperimentRunning = false;
            
            // Matikan lampu
            bulbright.classList.remove('on');
            bulbright.style.boxShadow = "none";
            lightGlow.classList.remove('on');
            
            // Hentikan gelembung
            stopBubbles();
            
            // Update status
            lightStatus.textContent = 'MATI';
            lightStatus.classList.remove('on');
            lightStatus.classList.add('off');
            lightStatusItem.classList.remove('active');
            
            bubbleStatus.textContent = 'TIDAK ADA';
            bubbleStatus.classList.remove('on');
            bubbleStatus.classList.add('off');
            bubbleStatusItem.classList.remove('active');
            
            // Kembalikan warna larutan ke normal
            beakerContent.style.background = 'linear-gradient(to top, rgba(14, 165, 233, 0.85) 0%, rgba(56, 189, 248, 0.75) 30%, rgba(96, 165, 250, 0.65) 100%)';
            beakerContent.style.boxShadow = 'none';
            
            // Update tombol
            startExperimentBtn.disabled = false;
            startExperimentBtn.style.opacity = '1';
            stopExperimentBtn.disabled = true;
            stopExperimentBtn.style.opacity = '0.7';

            electrolyteresult.classList.add("hidden");
        }
        
        // Fungsi untuk update tampilan larutan
        function updateSolutionAppearance() {
            const solution = solutions[currentSolution];
            
            if (solution.electrolyte && isExperimentRunning) {
                // Efek untuk elektrolit aktif
                const intensity = solution.lightIntensity;
                beakerContent.style.background = `linear-gradient(to top, 
                    rgba(14, 165, 233, ${0.85 + intensity * 0.1}) 0%, 
                    rgba(56, 189, 248, ${0.75 + intensity * 0.1}) 30%,
                    rgba(250, 204, 21, ${0.3 * intensity}) 100%)`;
                
                if (intensity > 0.7) {
                    beakerContent.style.boxShadow = 'inset 0 0 30px rgba(255, 235, 59, 0.3)';
                }
            } else {
                // Tampilan normal
                beakerContent.style.background = 'linear-gradient(to top, rgba(14, 165, 233, 0.85) 0%, rgba(56, 189, 248, 0.75) 30%, rgba(96, 165, 250, 0.65) 100%)';
                beakerContent.style.boxShadow = 'none';
            }
        }
        
        // Fungsi untuk membuat gelembung
        function createBubble(intensity = 1) {
            if (!isExperimentRunning) return;
            
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            // Ukuran acak untuk gelembung berdasarkan intensitas
            const size = Math.random() * 15 * intensity + 5;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // Posisi di sekitar elektroda (kiri atau kanan)
            const isLeft = Math.random() > 0.5;
            const leftPos = isLeft ? 
                Math.random() * 30 + 15 : // Elektroda kiri: 15%-45%
                Math.random() * 30 + 55;  // Elektroda kanan: 55%-85%
            bubble.style.left = `${leftPos}%`;
            
            const startBottom = Math.random() * 40; // 0-10% dari bawah
            bubble.style.bottom = `${startBottom}px`;
            
            // Hitung tinggi maksimal yang bisa dicapai
            const maxTravelDistance = (BUBBLE_MAX_HEIGHT - startBottom);
            
            // Animasi CSS dinamis
            const duration = Math.random() * 4 + 1; // 1-3 detik
            
            // Buat keyframes dinamis
            const animationName = `rise-${Date.now()}-${Math.random()}`;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ${animationName} {
                    0% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-${maxTravelDistance}px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            bubble.style.animation = `${animationName} ${duration}s linear forwards`;
            
            // Warna dan opacity berdasarkan intensitas
            const opacity = Math.random() * 0.4 * intensity + 0.2;
            bubble.style.background = `rgba(255, 255, 255, ${opacity})`;
            
            // Efek cahaya jika lampu menyala
            if (solutions[currentSolution].electrolyte) {
                bubble.style.boxShadow = `0 0 ${5 * intensity}px rgba(255, 255, 200, 0.5)`;
            }
            
            beakerContent.appendChild(bubble);
            
            // Hapus gelembung setelah selesai animasi
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.remove();
                }
            }, duration * 1000);
        }
        
        // Fungsi untuk memulai gelembung
        function startBubbles(intensity = 1) {
            // Buat beberapa gelembung awal
            for (let i = 0; i < 15 * intensity; i++) {
                setTimeout(() => createBubble(intensity), i * 200);
            }
            
            // Buat gelembung baru secara berkala
            const interval = Math.max(100, 500 / intensity); // Lebih cepat untuk intensitas tinggi
            bubbleInterval = setInterval(() => createBubble(intensity), interval);
        }
        
        // Fungsi untuk menghentikan gelembung
        function stopBubbles() {
            clearInterval(bubbleInterval);
            
            // Hapus semua gelembung secara bertahap
            const bubbles = document.querySelectorAll('.bubble');
            bubbles.forEach((bubble, index) => {
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.remove();
                    }
                }, index * 50);
            });
        }
        
        // Event listeners
        startExperimentBtn.addEventListener('click', startExperiment);
        stopExperimentBtn.addEventListener('click', stopExperiment);
        
        // Event listener untuk pemilihan larutan
        solutionItems.forEach(item => {
            item.addEventListener('click', () => {
                selectSolution(item.dataset.solution);

                
                // Jika eksperimen sedang berjalan, restart dengan larutan baru
                if (isExperimentRunning) {
                    stopExperiment();
                    setTimeout(() => startExperiment(), 300);
                }
            });
        });
        
        // Nonaktifkan tombol stop saat awal
        stopExperimentBtn.disabled = true;
        stopExperimentBtn.style.opacity = '0.7';
        
        // Tambahkan beberapa gelembung statis untuk efek visual awal
        for (let i = 0; i < 5; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 8 + 3;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 70 + 15}%`;
            bubble.style.bottom = `${Math.random() * 30 + 10}%`;
            bubble.style.opacity = '0.15';
            bubble.style.animation = 'none';
            beakerContent.appendChild(bubble);
        }