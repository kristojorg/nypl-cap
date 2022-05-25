import Capacitor

@objc(R2Plugin)
public class R2Plugin: CAPPlugin {
    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve(["value": value])
    }
    
    @objc func openReader(_ call: CAPPluginCall) {
//        self.bridge?.viewController.present
    }
}
