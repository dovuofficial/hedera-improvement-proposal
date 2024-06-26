document.addEventListener('DOMContentLoaded', () => {
    const typeCategoryCheckboxes = document.querySelectorAll('.hip-filters .filter:not(.check-all)');
    const checkAllCheckbox = document.querySelector('.hip-filters .check-all');
    const statusSelect = $('#status-filter');
    const councilApprovalFilters = document.querySelectorAll('input[name="council-approval-filter"]');
    const noHipsMessage = document.querySelector('.no-hips-message');
    const councilApprovalRadios = document.querySelectorAll('input[name="council-approval-filter"]');

    councilApprovalRadios.forEach(radio => {
        radio.addEventListener('click', (e) => {
            if (e.currentTarget.checked && e.currentTarget.getAttribute('data-checked') === 'true') {
                e.currentTarget.checked = false;
                e.currentTarget.setAttribute('data-checked', 'false');
                filterRows();
            } else {
                councilApprovalRadios.forEach(r => r.setAttribute('data-checked', 'false'));
                e.currentTarget.setAttribute('data-checked', 'true');
            }
        });
    });

    $('#status-filter').select2({
        placeholder: "Select statuses",
        allowClear: true
    }).on('change', () => {
        if (statusSelect.val().length === 0) {
            filterRows();
        } else {
            filterRows();
        }
    });

    function filterRows() {
        const selectedTypes = Array.from(typeCategoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value.trim().toLowerCase());

        // If nothing is selected in the Status select, treat it as "all"
        const selectedStatuses = statusSelect.val().length > 0 ? statusSelect.val() : ['all'];
        // If no council approval filter is selected, treat it as "all"
        const selectedCouncilApproval = document.querySelector('input[name="council-approval-filter"]:checked')?.value || 'all';
        let anyRowVisible = false;
        document.querySelectorAll('.hipstable tbody tr').forEach(row => {
            const rowTypes = [row.getAttribute('data-type').trim().toLowerCase(), row.getAttribute('data-category').trim().toLowerCase()];
            const rowStatus = row.getAttribute('data-status').trim().toLowerCase();
            const rowCouncilApproval = row.getAttribute('data-council-approval');

            const typeCategoryMatch = checkAllCheckbox.checked || selectedTypes.some(type => rowTypes.includes(type));
            const statusMatch = selectedStatuses.includes('all') || selectedStatuses.includes(rowStatus);
            const councilApprovalMatch = selectedCouncilApproval === 'all' || selectedCouncilApproval === rowCouncilApproval;

            if (typeCategoryMatch && statusMatch && councilApprovalMatch) {
                row.style.display = '';
                anyRowVisible = true;
            } else {
                row.style.display = 'none';
            }
        });

        noHipsMessage.style.display = anyRowVisible ? 'none' : 'block';
        updateTableVisibility();
    }
    

    function updateTableVisibility() {
        let anyTableVisible = false;

        document.querySelectorAll('.hipstable').forEach(table => {
            const isVisible = Array.from(table.querySelectorAll('tbody tr')).some(row => row.style.display !== 'none');
            anyTableVisible = anyTableVisible || isVisible;

            table.style.display = isVisible ? '' : 'none';
            const heading = table.previousElementSibling;
            if (heading) heading.style.display = isVisible ? '' : 'none';
        });

        noHipsMessage.textContent = anyTableVisible ? '' : 'No HIPs match this filter.';
    }

    function bindEventListeners() {
        typeCategoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const allChecked = Array.from(typeCategoryCheckboxes).every(cb => cb.checked);
                checkAllCheckbox.checked = allChecked;
                filterRows();
            });
        });
        
        if (checkAllCheckbox) {
            checkAllCheckbox.addEventListener('change', () => {
                const isChecked = checkAllCheckbox.checked;
                typeCategoryCheckboxes.forEach(cb => {
                    cb.checked = isChecked;
                });
                filterRows();
            });
        }
    
        if (councilApprovalFilters.length > 0) {
            councilApprovalFilters.forEach(filter => filter.addEventListener('change', filterRows));
        }
    }
    

    bindEventListeners();
    filterRows();
});
