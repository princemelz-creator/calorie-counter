document.addEventListener('DOMContentLoaded', () => {
    
    const calorieForm = document.getElementById('calorie-form');
    const foodNameInput = document.getElementById('food-name');
    const calorieInput = document.getElementById('calorie-amount');
    const foodListContainer = document.getElementById('food-list');
    const emptyStateView = document.getElementById('empty-state');
    const totalCaloriesDisplay = document.getElementById('total-calories');
    const itemCountBadge = document.getElementById('item-count');
    const resetDayButton = document.getElementById('reset-day-btn');
    
    const apiSearchInput = document.getElementById('api-search-input');
    const apiSearchButton = document.getElementById('api-search-btn');
    const apiStatusMessage = document.getElementById('api-status-msg');

    let loggedFoods = JSON.parse(localStorage.getItem('biteBalance_meals')) || [];

    function updateApplicationState() {
        localStorage.setItem('biteBalance_meals', JSON.stringify(loggedFoods));
        
        renderFoodList();
        calculateTotalCalories();
    }

    function renderFoodList() {
        foodListContainer.innerHTML = '';
        
        if (loggedFoods.length === 0) {
            emptyStateView.classList.remove('hidden');
            foodListContainer.classList.add('hidden');
            itemCountBadge.textContent = '0 Items';
            return;
        }

        emptyStateView.classList.add('hidden');
        foodListContainer.classList.remove('hidden');
        itemCountBadge.textContent = `${loggedFoods.length} ${loggedFoods.length === 1 ? 'Item' : 'Items'}`;


        loggedFoods.forEach(food => {
            const listItem = document.createElement('li');
            listItem.className = "flex justify-between items-center bg-slate-50 border border-slate-100 hover:border-slate-200 px-4 py-3 rounded-xl transition group shadow-sm";
            listItem.setAttribute('data-id', food.id);

            listItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span class="font-medium text-slate-700 capitalize">${escapeHtml(food.name)}</span>
                </div>
                <div class="flex items-center gap-4">
                    <span class="font-bold text-slate-600 text-sm bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">${food.calories} kcal</span>
                    <button class="delete-btn text-slate-400 hover:text-red-500 font-medium transition opacity-100 lg:opacity-0 group-hover:opacity-100 p-1 text-sm focus:outline-none" aria-label="Delete entry">
                        ✕
                    </button>
                </div>
            `;
            foodListContainer.appendChild(listItem);
        });
    }

    
    function calculateTotalCalories() {
        const aggregatedCalories = loggedFoods.reduce((total, item) => total + item.calories, 0);
        
        animateValue(totalCaloriesDisplay, parseInt(totalCaloriesDisplay.textContent) || 0, aggregatedCalories, 400);
    }

    
    function animateValue(obj, start, end, duration) {
        if (start === end) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    calorieForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInputRaw = foodNameInput.value.trim();
        const calorieValue = parseInt(calorieInput.value, 10);

        if (!nameInputRaw || isNaN(calorieValue) || calorieValue <= 0) return;

        const newFoodItem = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: nameInputRaw,
            calories: calorieValue
        };

        loggedFoods.push(newFoodItem);
        updateApplicationState();

        calorieForm.reset();
        foodNameInput.focus();
    });

    foodListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const chosenRow = e.target.closest('li');
            const targetedId = chosenRow.getAttribute('data-id');

        
            chosenRow.style.opacity = '0';
            chosenRow.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                loggedFoods = loggedFoods.filter(item => item.id !== targetedId);
                updateApplicationState();
            }, 200);
        }
    });

   
    resetDayButton.addEventListener('click', () => {
        if (loggedFoods.length === 0) return;
        
        if (confirm("Are you sure you want to clear your daily tracking logs? This step cannot be undone.")) {
            loggedFoods = [];
            updateApplicationState();
        }
    });

  
    async function simulateDatabaseApiFetch(searchQuery) {
        apiStatusMessage.textContent = "Connecting to cloud data pool...";
        apiStatusMessage.className = "text-xs text-indigo-400 mt-3 h-4 italic";
        
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
            if (!response.ok) throw new Error("Network latency failed check parameters.");
            
            await new Promise(resolve => setTimeout(resolve, 800));

        
            const localMockDatabase = {
                'avocado': 240,
                'apple': 95,
                'pizza': 285,
                'chicken breast': 165,
                'banana': 105,
                'egg': 78,
                'coffee': 2,
                'salmon': 208,
                'oatmeal': 150
            };

            const cleanQuery = searchQuery.toLowerCase().trim();
            
            if (localMockDatabase.hasOwnProperty(cleanQuery)) {
                const foundCalories = localMockDatabase[cleanQuery];
                
        
                foodNameInput.value = cleanQuery;
                calorieInput.value = foundCalories;
                
                apiStatusMessage.textContent = `🎯 Data found for "${searchQuery}"! Values applied to form.`;
                apiStatusMessage.className = "text-xs text-emerald-600 mt-3 h-4 font-semibold";
            } else {
                apiStatusMessage.textContent = "⚠️ Item missing from macro index database. Try typing manual metrics.";
                apiStatusMessage.className = "text-xs text-amber-600 mt-3 h-4 font-medium";
            }

        } catch (error) {
            apiStatusMessage.textContent = "❌ Failed to query database endpoint system references.";
            apiStatusMessage.className = "text-xs text-red-500 mt-3 h-4 font-bold";
            console.error("API Fetch Error Event log tracker trace tracking signature:", error);
        }
    }

   
    apiSearchButton.addEventListener('click', () => {
        const query = apiSearchInput.value.trim();
        if (!query) {
            apiStatusMessage.textContent = "Please enter a search term first.";
            apiStatusMessage.className = "text-xs text-amber-500 mt-3 h-4";
            return;
        }
        simulateDatabaseApiFetch(query);
    });

   
    function escapeHtml(textStr) {
        const characterMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return textStr.replace(/[&<>"']/g, function(m) { return characterMap[m]; });
    }


    updateApplicationState();
});