import Foundation
import Capacitor
import Combine
import R2Shared
import R2Streamer
import UIKit

@objc(R2Plugin)
public class R2Plugin: CAPPlugin {
    
    private var pluginReceiver: CAPPluginCall?
    
    private lazy var module: SampleModule = {
        let module = SampleModule()
        module.delegate = self
        return module
    }()
    
    // named openBook temporarily to work with the existing setup
    // perform the first time setups
    @objc func openBook(_ call: CAPPluginCall) {
        call.keepAlive = true
        pluginReceiver = call
        
        DispatchQueue.main.async {
            self.bridge?.viewController?.present(self.module.viewController, animated: true, completion: nil)
        }
    }
    
    @objc func update(_ call: CAPPluginCall) {
        guard let array = call.getArray("samples") else {
            call.reject("Could not parse plugin call")
            return
        }
        
        let models: [SampleModel] = array.compactMap {
            guard let element = $0 as? JSObject,
                  let id = element["id"] as? String,
                  let title = element["title"] as? String else { return nil }
            return SampleModel(id: id, title: title)
        }
        
        module.receiveModels(models: models)
                
        call.resolve()
    }
    
    @objc func displayError(_ call: CAPPluginCall) {
        let message = call.getString("message")
        
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: nil))
        
        self.bridge?.viewController?.present(alert, animated: true, completion: nil)
        
        call.resolve()
    }
}

extension R2Plugin: SampleModuleDelegate {
        
    func createSampleModel(sampleModel: SampleModel) {
        pluginReceiver?.resolve([
            "action": "create-model",
            "model": [
                "id": sampleModel.id,
                "title": sampleModel.title
            ]
        ])
    }
    
    func updateSampleModel(sampleModel: SampleModel) {
        guard let id = sampleModel.id else { return }

        pluginReceiver?.resolve([
            "action": "update-model",
            "model-id": id,
            "title": sampleModel.title
        ])
    }
    
    func deleteSampleModel(sampleModel: SampleModel) {
        guard let id = sampleModel.id else { return }

        pluginReceiver?.resolve([
            "action": "delete-model",
            "model-id": id
        ])
    }
}
