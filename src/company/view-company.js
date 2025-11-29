import { createClient } from '@supabase/supabase-js'

// Supabase connection
const supabaseUrl = 'https://togfwlwthtllzwmoclsz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2Z3bHd0aHRsbHp3bW9jbHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzA5MDYsImV4cCI6MjA3OTkwNjkwNn0.n0br_yh9IWxIq_iDxLa5cO-A3G5K9dScYdaaTXAOEnM'
const supabase = createClient(supabaseUrl, supabaseKey)

// Get company ID from URL
const urlParams = new URLSearchParams(window.location.search)
const companyId = urlParams.get('id')

// Load company when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (companyId) {
        loadCompany()
    } else {
        alert('No company ID provided')
        window.location.href = '/'
    }
})

// Load and display company details
async function loadCompany() {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()

    if (error) {
        alert('Error loading company: ' + error.message)
        window.location.href = '/'
        return
    }

    // Populate view fields
    document.getElementById('viewCompanyId').textContent = data.company_id
    document.getElementById('viewCompanyName').textContent = data.company_name
    document.getElementById('viewHasDba').textContent = data.has_dba
    document.getElementById('viewDbaName').textContent = data.dba_name
    document.getElementById('viewPhone').textContent = data.company_phone
    document.getElementById('viewAddress1').textContent = data.address_line1
    document.getElementById('viewAddress2').textContent = data.address_line2 || '-'
    document.getElementById('viewCity').textContent = data.city
    document.getElementById('viewState').textContent = data.state
    document.getElementById('viewZip').textContent = data.zip
    document.getElementById('viewCreatedBy').textContent = data.created_by
    document.getElementById('viewCreatedAt').textContent = new Date(data.created_at).toLocaleString()
    document.getElementById('viewModifiedBy').textContent = data.modified_by
    document.getElementById('viewModifiedAt').textContent = new Date(data.modified_at).toLocaleString()
}

// Navigate to edit company page
window.editCompany = function() {
    window.location.href = '/pages/company/edit-company.html?id=' + companyId
}