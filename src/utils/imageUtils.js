import { supabase } from './supabaseClient';

export const pickAndUploadImage = async () => {
    return new Promise((resolve) => {
     const input = document.createElement('input');
     input.type = 'file'; input.accept = 'image/*';
     input.onchange = async (e) => {
       const file = e.target.files[0]; if (!file) return resolve(null);
       try {
         const fileName = `${Date.now()}_${Math.random()}.${file.name.split('.').pop()}`;
         const { error } = await supabase.storage.from('app_images').upload(fileName, file);
         if (error) { alert("Upload Error: " + error.message); return resolve(null); }
         const { data: { publicUrl } } = supabase.storage.from('app_images').getPublicUrl(fileName);
         resolve(publicUrl);
       } catch (error) { alert('Upload failed.'); resolve(null); }
     };
     input.click();
   });
 };
