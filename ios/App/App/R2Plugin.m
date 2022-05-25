#import <Capacitor/Capacitor.h>

CAP_PLUGIN(R2Plugin, "R2",
    CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
)
