import { writable } from 'svelte/store';
export const solutionType = writable('');
export const formatType = writable('');
export const formData = writable({
    components: [],
    solvent: '',
    packagingType: '',
    volume: '',
    units: 1,
    qualityLevel: '',
    analyticalTechnique: '',
});
export const AddNoted = writable('');
export const Cusdetails = writable({
    Title: '',
    FirstName: '',
    LastName: '',
    Organisation: '',
    Country: '',
    // LGC: '',
    Email: '',
    Number: '',
});
export const Delivery = writable({
    Address1: '',
    Address2: '',
    Country: '',
    County: '',
    City: '',
    Post: '',
});
export const isCleared = writable(false);
export function resetFormData() {
    isCleared.set(true);
    setTimeout(() => { isCleared.set(false); }, 3000);
    solutionType.set('');
    formatType.set('');
    formData.set({
        components: [],
        solvent: '',
        packagingType: '',
        volume: '',
        units: 1,
        qualityLevel: '',
        analyticalTechnique: '',
    });
    AddNoted.set('');
    Cusdetails.set({
        Title: '',
        FirstName: '',
        LastName: '',
        Organisation: '',
        Country: '',
        // LGC: '',
        Email: '',
        Number: '',
    });
    Delivery.set({
        Address1: '',
        Address2: '',
        Country: '',
        County: '',
        City: '',
        Post: '',
    });
}