using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Hosting;
using LiteDB;
using ServerMonitor.Models;

namespace ServerMonitor.Helpers
{
    public class NoteHelper
    {
        private static string DbPath => HostingEnvironment.MapPath("~/ServerMonitor.db");

        public void Save(string buildName, string note)
        {
            using (var db = new LiteDatabase(DbPath))
            {
                var col = db.GetCollection<BuildNote>("BuildNotes");

                var buildNote = col.Find(c => c.BuildName == buildName).FirstOrDefault();

                if (buildNote == null)
                {
                    col.Insert(new BuildNote
                    {
                        Id = new Guid(),
                        BuildName = buildName,
                        Note = note
                    });
                }
                else
                {
                    buildNote.Note = note;
                    col.Update(buildNote);
                }

                col.EnsureIndex(x => x.BuildName);
            }
        }
        
        public List<BuildNote> GetAll()
        {
            using (var db = new LiteDatabase(DbPath))
            {
                var col = db.GetCollection<BuildNote>("BuildNotes").FindAll().ToList();
                return col;
            }
        }

        public string Get(string name)
        {
            using (var db = new LiteDatabase(DbPath))
            {
                var col = db.GetCollection<BuildNote>("BuildNotes");

                var note = col.Find(c => c.BuildName == name).FirstOrDefault();
                return note?.Note;
            }
        }

    }
}