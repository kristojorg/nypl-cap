#import <Capacitor/Capacitor.h>

CAP_PLUGIN(R2Plugin, "R2",
   CAP_PLUGIN_METHOD(present, CAPPluginReturnNone);
   CAP_PLUGIN_METHOD(openBook, CAPPluginReturnCallback);
)
