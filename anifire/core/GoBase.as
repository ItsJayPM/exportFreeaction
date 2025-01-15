package anifire.core
{
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.utils.getDefinitionByName;
   
   public class GoBase extends Sprite
   {
      public function GoBase()
      {
         super();
         this.addEventListener(Event.FRAME_CONSTRUCTED,this.doInitSkin);
      }
      
      private function doInitSkin(param1:Event) : void
      {
         this.removeEventListener(Event.FRAME_CONSTRUCTED,this.doInitSkin);
         var _loc2_:Class = getDefinitionByName("anifire.core.GoBaseWorkerImp") as Class;
         var _loc3_:GoBaseWorker = new _loc2_();
         var _loc4_:Function = _loc3_["initSkin"];
         _loc4_(this);
      }
   }
}

