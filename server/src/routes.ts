import { Router } from 'express'; import { z } from 'zod'; import { Contact, Project, Service, SiteSettings } from './models';
const projectBody=z.object({title:z.string().min(2),slug:z.string().min(2),category:z.string().min(2),description:z.string().min(2),thumbnail:z.string().url(),mediaUrl:z.string().url(),mediaType:z.enum(['image','video','youtube','vimeo']).default('image'),platform:z.enum(['local','youtube','vimeo','instagram','external']).default('external'),externalUrl:z.string().url().optional(),featured:z.boolean().optional(),order:z.number().optional()}); const serviceBody=z.object({title:z.string().min(2),description:z.string().min(2),icon:z.string().optional(),order:z.number().optional(),active:z.boolean().optional()}); const contactBody=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),company:z.string().trim().max(100).optional(),projectType:z.string().trim().max(100).optional(),message:z.string().trim().min(10).max(3000)});
function crud<T extends {find:Function;findById:Function;findByIdAndUpdate:Function;findByIdAndDelete:Function;create:Function}>(model:T, schema:z.AnyZodObject){const r=Router();r.get('/',async(_,res,next)=>{try{res.json(await model.find().sort({order:1}));}catch(e){next(e)}});r.post('/',async(req,res,next)=>{try{res.status(201).json(await model.create(schema.parse(req.body)));}catch(e){next(e)}});r.put('/:id',async(req,res,next)=>{try{const result=await model.findByIdAndUpdate(req.params.id,schema.partial().parse(req.body),{new:true,runValidators:true});if(!result)return res.status(404).json({message:'Resource not found'});res.json(result)}catch(e){next(e)}});r.delete('/:id',async(req,res,next)=>{try{const result=await model.findByIdAndDelete(req.params.id);if(!result)return res.status(404).json({message:'Resource not found'});res.status(204).send()}catch(e){next(e)}});return r}
export const projects=crud(Project,projectBody); projects.get('/featured',async(_,res,next)=>{try{res.json(await Project.find({featured:true}).sort({order:1}));}catch(e){next(e)}}); projects.get('/:slug',async(req,res,next)=>{try{const item=await Project.findOne({slug:req.params.slug});if(!item)return res.status(404).json({message:'Project not found'});res.json(item)}catch(e){next(e)}});
import { Resend } from 'resend';
export const services=crud(Service,serviceBody); export const contacts=Router(); contacts.post('/',async(req,res,next)=>{try{const inquiry=await Contact.create(contactBody.parse(req.body));
if(process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL){
  try{
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: '7bit Media Inquiry <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL,
      subject: `New Project Inquiry from ${inquiry.name}`,
      html: `<div style="font-family: sans-serif; padding: 20px; color: #111;"><h2>New Contact Form Inquiry</h2><p><strong>Name:</strong> ${inquiry.name}</p><p><strong>Email:</strong> ${inquiry.email}</p><p><strong>Company:</strong> ${inquiry.company || 'N/A'}</p><p><strong>Project Type:</strong> ${inquiry.projectType || 'N/A'}</p><p><strong>Message:</strong></p><blockquote style="background: #f5f5f5; padding: 12px; border-left: 4px solid #111;">${inquiry.message}</blockquote></div>`
    });
  }catch(err){
    console.error('Failed to send Resend email notification:', err);
  }
}
res.status(201).json({message:'Inquiry received',id:inquiry.id});}catch(e){next(e)}}); contacts.get('/',async(_,res,next)=>{try{res.json(await Contact.find().sort({createdAt:-1}));}catch(e){next(e)}});
export const settings=Router(); settings.get('/',async(_,res,next)=>{try{const current=await SiteSettings.findOne();if(!current)return res.status(404).json({message:'Settings not configured'});res.json(current)}catch(e){next(e)}}); settings.put('/',async(req,res,next)=>{try{res.json(await SiteSettings.findOneAndUpdate({},req.body,{new:true,upsert:true,runValidators:true}))}catch(e){next(e)}});
